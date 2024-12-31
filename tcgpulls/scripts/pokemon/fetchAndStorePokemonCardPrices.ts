import { fetchPokemonTcgApiSetCards } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "@/utils/customLog";
import { prisma } from "@/lib/prisma";
import pLimit from "p-limit";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";
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
) {
  customLog(
    `\n⏳ Fetching price data for set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );

  try {
    const cardsData = await fetchPokemonTcgApiSetCards(language, set.setId);
    if (!Array.isArray(cardsData) || cardsData.length === 0) {
      customLog(
        "warn",
        `⚠️ No card data returned for set: ${set.setId}, language: ${language}`,
      );
      return;
    }

    const filteredCardsData = specifiedCardId
      ? cardsData.filter((c) => c.id === specifiedCardId)
      : cardsData;

    if (filteredCardsData.length === 0) {
      customLog(
        "warn",
        `⚠️ No fetched card matches --cardId=${specifiedCardId}. Skipping.`,
      );
      return;
    }

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
            return;
          }

          for (const dbCard of matchingDbCards) {
            priceHistoryEntries.push({
              cardId: dbCard.id,
              variant: dbCard.variant,
              fetchedAt: new Date(),
              tcgplayerData: fetchedCard.tcgplayer || null,
              cardmarketData: fetchedCard.cardmarket || null,
            });
          }
        }),
      ),
    );

    if (priceHistoryEntries.length > 0) {
      await prisma.pokemonCardPriceHistory.createMany({
        data: priceHistoryEntries,
        skipDuplicates: true,
      });
      counters.totalPriceEntriesInserted += priceHistoryEntries.length;
      customLog(
        `💾 Inserted ${priceHistoryEntries.length} price history entries for set: ${set.name} (${language})`,
      );
    }
  } catch (error) {
    customLog(
      "error",
      `❌ Error processing set: ${set.name} (Language: ${language})`,
      error,
    );
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
    for (const setChunk of setChunks) {
      await Promise.all(
        setChunk.map((set) =>
          Promise.all(
            POKEMON_SUPPORTED_LANGUAGES.map((language) =>
              processOneSetAndLanguage(set, language, specifiedCardId, counters)
                .then(() => {
                  totalSetsProcessed++;
                })
                .catch((err) => {
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

      // Add a delay between chunks to prevent resource exhaustion
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Mark these sets as updated "now"
    // so we don't re-fetch them again in another chunk run.
    await prisma.pokemonSet.updateMany({
      where: {
        id: { in: sets.map((s) => s.id) },
      },
      data: {
        lastPriceFetchDate: new Date(),
      },
    });

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
