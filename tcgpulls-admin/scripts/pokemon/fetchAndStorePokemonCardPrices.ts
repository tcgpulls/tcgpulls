import pLimit from "p-limit";
import serverLog from "../../utils/serverLog";
import getKeystoneContext from "../../getKeystoneContext";
import { fetchPokemonTcgApiSetCards } from "../../lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import { POKEMON_SUPPORTED_LANGUAGES } from "../../constants/tcg/pokemon";
import { Prisma } from "@prisma/client";

// ----------------------
// Command line arguments
// ----------------------
const args = process.argv.slice(2);
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

// ----------------------
// Concurrency settings
// ----------------------
const SET_CONCURRENCY_LIMIT = parseInt(
  process.env.POKEMON_SET_PRICES_CRON_CHUNK_SIZE || "10",
  10,
);
const CARD_CONCURRENCY_LIMIT = 10;
const limitCardLevel = pLimit(CARD_CONCURRENCY_LIMIT);

/** Utility to chunk an array into smaller batches of given size */
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Fetches the external API for one set + language,
 * then inserts daily price rows into PokemonCardPriceHistory.
 *
 * @returns {boolean} true if everything succeeded, false if any failure occurred
 */
async function processOneSetAndLanguage(
  prisma: any,
  set: any,
  language: string,
  specifiedCardId: string | null,
  counters: {
    totalPriceEntriesInserted: number;
    totalCardsWithoutDbMatch: number;
    unmatchedCardIds: string[];
  },
): Promise<boolean> {
  serverLog(
    `\n⏳ Fetching price data for set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );

  try {
    // We'll create a date truncated to midnight for "one entry per day"
    const priceDate = new Date();
    priceDate.setUTCHours(0, 0, 0, 0);

    // 1) Fetch data
    const cardsData = await fetchPokemonTcgApiSetCards(language, set.setId);
    if (!Array.isArray(cardsData) || cardsData.length === 0) {
      serverLog(
        "warn",
        `⚠️ No card data returned for set: ${set.setId}, language: ${language}`,
      );
      // Fail => skip updating lastPriceFetchDate
      return false;
    }

    // 2) Filter if specified card
    const filteredCardsData = specifiedCardId
      ? cardsData.filter((c) => c.id === specifiedCardId)
      : cardsData;

    if (specifiedCardId && filteredCardsData.length === 0) {
      serverLog(
        "warn",
        `⚠️ No fetched card matches --cardId=${specifiedCardId}. Skipping.`,
      );
      return false;
    }

    // 3) Build the price history entries
    const priceHistoryEntries: Prisma.PokemonCardPriceHistoryCreateManyInput[] =
      [];

    await Promise.all(
      filteredCardsData.map((fetchedCard) =>
        limitCardLevel(async () => {
          // Find the matching DB cards in PokemonCard
          const matchingDbCards = await prisma.pokemonCard.findMany({
            where: {
              cardId: fetchedCard.id,
              setId: set.id,
              language,
            },
          });

          // If no match => track as "unmatched"
          if (matchingDbCards.length === 0) {
            counters.totalCardsWithoutDbMatch++;
            counters.unmatchedCardIds.push(fetchedCard.id);
            return;
          }

          // Add to our "batch" for createMany
          for (const dbCard of matchingDbCards) {
            priceHistoryEntries.push({
              cardId: dbCard.id, // This is the PK from PokemonCard
              variant: dbCard.variant,
              fetchedAt: new Date(),
              tcgplayerData: fetchedCard.tcgplayer || null,
              cardmarketData: fetchedCard.cardmarket || null,
              priceDate,
            });
          }
        }),
      ),
    );

    // 4) Insert if we have anything
    if (priceHistoryEntries.length > 0) {
      // We use .createMany w/ skipDuplicates because we rely on a DB-level unique constraint
      await prisma.pokemonCardPriceHistory.createMany({
        data: priceHistoryEntries,
        skipDuplicates: true,
      });
      counters.totalPriceEntriesInserted += priceHistoryEntries.length;
      serverLog(
        `💾 Inserted ${priceHistoryEntries.length} price history entries for set: ${set.name} (${language})`,
      );
    } else {
      // If we never inserted anything => consider that a failure so we retry next time
      return false;
    }

    return true; // success
  } catch (error) {
    serverLog(
      "error",
      `❌ Error processing set: ${set.name} (Language: ${language})`,
      error,
    );
    return false;
  }
}

/**
 * Main function to fetch and store Pokemon prices.
 *
 * @param {number} chunkSize - how many sets to process in this invocation
 */
export async function fetchAndStorePokemonPrices(chunkSize: number = 10) {
  // Create Keystone context (sudo mode to bypass access checks)
  const ksContext = await getKeystoneContext({ sudo: true });
  const { prisma } = ksContext; // Use Prisma via ksContext.prisma

  const counters = {
    totalPriceEntriesInserted: 0,
    totalCardsWithoutDbMatch: 0,
    unmatchedCardIds: [] as string[],
  };
  let totalSetsProcessed = 0;
  serverLog("Fetching and storing Pokemon card prices...");

  // Compute "today" in UTC, zero out time for daily logic
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    let sets: any[];

    // If we have a --setId param, we fetch *only* that set
    if (specifiedSetId) {
      sets = await prisma.pokemonSet.findMany({
        where: { setId: specifiedSetId },
      });
      serverLog(
        `🔍 Found ${sets.length} sets matching setId=${specifiedSetId}.`,
      );
    } else {
      // Otherwise, we fetch up to `chunkSize` sets that are not yet updated today
      sets = await prisma.pokemonSet.findMany({
        where: {
          OR: [
            { lastPriceFetchDate: null },
            { lastPriceFetchDate: { lt: today } },
          ],
        },
        take: chunkSize,
      });
      serverLog(
        `🔍 Found ${sets.length} sets that need an update (chunkSize=${chunkSize}).`,
      );
    }

    if (sets.length === 0) {
      serverLog("info", "✅ No sets left to update. Already done for today.");
      return;
    }

    const setChunks = chunkArray(sets, SET_CONCURRENCY_LIMIT);
    // We'll track if ANY set in this entire run fails
    let anySetFailed = false;

    for (const setChunk of setChunks) {
      let chunkFailed = false; // track chunk-level success/failure

      // Process each set in the chunk, for each language
      await Promise.all(
        setChunk.map((set) =>
          Promise.all(
            POKEMON_SUPPORTED_LANGUAGES.map((language) =>
              processOneSetAndLanguage(
                prisma,
                set,
                language,
                specifiedCardId,
                counters,
              )
                .then((success) => {
                  totalSetsProcessed++;
                  if (!success) {
                    chunkFailed = true;
                  }
                })
                .catch((err) => {
                  chunkFailed = true;
                  serverLog(
                    "error",
                    `❌ Error in processOneSetAndLanguage for setId=${set.setId}, language=${language}`,
                    err,
                  );
                }),
            ),
          ),
        ),
      );

      // If the chunk was fully successful, update lastPriceFetchDate
      if (!chunkFailed) {
        await prisma.pokemonSet.updateMany({
          where: {
            id: { in: setChunk.map((s) => s.id) },
          },
          data: {
            lastPriceFetchDate: new Date(),
          },
        });
      } else {
        // Mark the entire chunk as a failure => they get retried next time
        anySetFailed = true;
      }

      // Add a delay between chunks to prevent resource exhaustion
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Summary
    serverLog("\n--- Price Insertion Summary ---");
    serverLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    serverLog(
      `💰 Total PriceHistory Entries Inserted: ${counters.totalPriceEntriesInserted}`,
    );
    serverLog(
      `❓ Total Fetched Cards with No Matching DB Card: ${counters.totalCardsWithoutDbMatch}`,
    );

    if (counters.unmatchedCardIds.length > 0) {
      serverLog(
        "warn",
        `🔎 Unmatched externalCardIds:\n${counters.unmatchedCardIds.join(", ")}`,
      );
    }

    if (anySetFailed) {
      serverLog(
        "warn",
        "⚠️ Some sets failed and were NOT marked as updated. They will be retried on the next cron run.",
      );
    } else {
      serverLog("info", "✅ All sets successfully updated!");
    }
  } catch (error) {
    serverLog("error", "❌ Error during fetching and storing prices", error);
  } finally {
    await ksContext.prisma.$disconnect(); // close out DB connections
  }
}

// Keep CLI usage the same
if (require.main === module) {
  const chunkSizeArg = args.find((arg) => arg.startsWith("--chunkSize="));
  const chunkSize = chunkSizeArg
    ? parseInt(chunkSizeArg.split("=")[1], 10)
    : 10;

  fetchAndStorePokemonPrices(chunkSize).catch((error) => {
    serverLog("error", "❌ Error in fetchAndStorePokemonPrices script:", error);
    process.exit(1);
  });
}
