import { fetchPokemonTcgApiSetCards } from "tcgpulls/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "tcgpulls/utils/customLog";
import { prisma } from "@tcg/prisma";
import pLimit from "p-limit";
import { POKEMON_SUPPORTED_LANGUAGES } from "tcgpulls/constants/tcg/pokemon";
import { Prisma } from "@prisma/client"; // Import Prisma types

// Command line arguments (optional)
const args = process.argv.slice(2);
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

// Concurrency settings
const SET_CONCURRENCY_LIMIT = parseInt(
  process.env.POKEMON_SET_PRICES_CRON_CHUNK_SIZE || "10",
  10,
); // Adjusted for smaller batches
const CARD_CONCURRENCY_LIMIT = 10; // Concurrency for handling cards
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
  set: any,
  language: string,
  specifiedCardId: string | null,
  counters: {
    totalPriceEntriesInserted: number;
    totalCardsWithoutDbMatch: number;
    unmatchedCardIds: string[];
  },
): Promise<boolean> {
  customLog(
    `\n⏳ Fetching price data for set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );

  try {
    // We'll create a date truncated to midnight for "one entry per day"
    const priceDate = new Date();
    priceDate.setUTCHours(0, 0, 0, 0);

    // 1) Fetch data
    const cardsData = await fetchPokemonTcgApiSetCards(language, set.setId);
    if (!Array.isArray(cardsData) || cardsData.length === 0) {
      customLog(
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

    if (filteredCardsData.length === 0) {
      customLog(
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
          const matchingDbCards = await prisma.pokemonCard.findMany({
            where: {
              cardId: fetchedCard.id,
              setId: set.id,
              language,
            },
          });

          if (matchingDbCards.length === 0) {
            counters.totalCardsWithoutDbMatch++;
            counters.unmatchedCardIds.push(fetchedCard.id);
            // Could treat this as a "soft" fail or a "hard" fail.
            // If you want ANY mismatch to fail the entire set, return false.
            // For minimal changes, let's just continue but set is still partial success.
            // If you DO want to fail, you'd do: return false;
            return;
          }

          // Add to our batch
          for (const dbCard of matchingDbCards) {
            priceHistoryEntries.push({
              // Important: "cardId" (the PK from PokemonCard table)
              cardId: dbCard.id,
              variant: dbCard.variant,
              fetchedAt: new Date(),
              tcgplayerData: fetchedCard.tcgplayer || null,
              cardmarketData: fetchedCard.cardmarket || null,
              // NEW: daily price date
              priceDate,
            });
          }
        }),
      ),
    );

    // 4) Insert if we have anything
    if (priceHistoryEntries.length > 0) {
      await prisma.pokemonCardPriceHistory.createMany({
        data: priceHistoryEntries,
        skipDuplicates: true, // combined with DB unique constraint => no duplicates
      });
      counters.totalPriceEntriesInserted += priceHistoryEntries.length;
      customLog(
        `💾 Inserted ${priceHistoryEntries.length} price history entries for set: ${set.name} (${language})`,
      );
    } else {
      // If we never inserted anything => consider that a failure so we retry next time
      return false;
    }

    return true; // success
  } catch (error) {
    customLog(
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
  const counters = {
    totalPriceEntriesInserted: 0,
    totalCardsWithoutDbMatch: 0,
    unmatchedCardIds: [] as string[],
  };
  let totalSetsProcessed = 0;
  customLog("Fetching and storing Pokemon card prices...");

  // Compute "today" in UTC (zero out time if you want true daily logic)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    /**
     * If we have a --setId param, we fetch *only* that set.
     * Otherwise, we fetch up to `chunkSize` sets that are not yet updated today.
     */
    let sets: any[];

    if (specifiedSetId) {
      sets = await prisma.pokemonSet.findMany({
        where: { setId: specifiedSetId },
      });
      customLog(
        `🔍 Found ${sets.length} sets matching setId=${specifiedSetId}.`,
      );
    } else {
      sets = await prisma.pokemonSet.findMany({
        where: {
          OR: [
            { lastPriceFetchDate: null },
            { lastPriceFetchDate: { lt: today } },
          ],
        },
        take: chunkSize, // only take a small batch
      });
      customLog(
        `🔍 Found ${sets.length} sets that need an update (chunkSize=${chunkSize}).`,
      );
    }

    if (sets.length === 0) {
      customLog("info", "✅ No sets left to update. Already done for today.");
      return;
    }

    const setChunks = chunkArray(sets, SET_CONCURRENCY_LIMIT);
    // We'll track if ANY set in this entire run fails
    let anySetFailed = false;

    for (const setChunk of setChunks) {
      // If you prefer chunk-level logic, you can track chunkFailed instead.
      // Minimally, let's track "did the chunk fail" to skip updating lastPriceFetchDate for that chunk.
      let chunkFailed = false;

      await Promise.all(
        setChunk.map((set) =>
          Promise.all(
            POKEMON_SUPPORTED_LANGUAGES.map((language) =>
              // Use .then(...) to get the boolean return
              processOneSetAndLanguage(set, language, specifiedCardId, counters)
                .then((success) => {
                  totalSetsProcessed++;
                  if (!success) {
                    chunkFailed = true;
                  }
                })
                .catch((err) => {
                  // If we ever catch an error => chunk is a failure
                  chunkFailed = true;
                  customLog(
                    "error",
                    `❌ Error in processOneSetAndLanguage for setId=${set.setId}, language=${language}`,
                    err,
                  );
                }),
            ),
          ),
        ),
      );

      if (chunkFailed) {
        // Mark the entire chunk as a failure => skip updating lastPriceFetchDate
        anySetFailed = true;
      } else {
        // If the chunk was fully successful, update lastPriceFetchDate for these sets
        await prisma.pokemonSet.updateMany({
          where: {
            id: { in: setChunk.map((s) => s.id) },
          },
          data: {
            lastPriceFetchDate: new Date(),
          },
        });
      }

      // Add a delay between chunks to prevent resource exhaustion
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Summary
    customLog("\n--- Price Insertion Summary ---");
    customLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    customLog(
      `💰 Total PriceHistory Entries Inserted: ${counters.totalPriceEntriesInserted}`,
    );
    customLog(
      `❓ Total Fetched Cards with No Matching DB Card: ${counters.totalCardsWithoutDbMatch}`,
    );

    if (counters.unmatchedCardIds.length > 0) {
      customLog(
        "warn",
        `🔎 Unmatched externalCardIds:\n${counters.unmatchedCardIds.join(", ")}`,
      );
    }

    if (anySetFailed) {
      customLog(
        "warn",
        "⚠️ Some sets failed and were NOT marked as updated. They will be retried on the next cron run.",
      );
    } else {
      customLog("info", "✅ All sets successfully updated!");
    }
  } catch (error) {
    customLog("error", "❌ Error during fetching and storing prices", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Keep CLI usage the same
if (require.main === module) {
  const chunkSizeArg = args.find((arg) => arg.startsWith("--chunkSize="));
  const chunkSize = chunkSizeArg
    ? parseInt(chunkSizeArg.split("=")[1], 10)
    : 10;

  fetchAndStorePokemonPrices(chunkSize).catch((error) => {
    customLog("error", "❌ Error in fetchAndStorePokemonPrices script:", error);
    process.exit(1);
  });
}
