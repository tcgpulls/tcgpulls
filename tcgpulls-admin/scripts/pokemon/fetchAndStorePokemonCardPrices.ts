import "dotenv/config";
import pLimit from "p-limit";
import serverLog from "../../utils/serverLog";
import getKeystoneContext from "../../getKeystoneContext";
import { fetchPokemonTcgApiSetCards } from "../../lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import { POKEMON_SUPPORTED_LANGUAGES } from "../../constants/tcg/pokemon";

const chunkSize =
  parseInt(process.env.POKEMON_SET_PRICES_CRON_CHUNK_SIZE!, 10) || 10;

const SET_CONCURRENCY_LIMIT = 5; // how many sets to process in parallel
const CARD_CONCURRENCY_LIMIT = 10; // how many price inserts per set in parallel

const limitCardLevel = pLimit(CARD_CONCURRENCY_LIMIT);

/**
 * Utility to chunk an array into smaller batches of given size.
 */
function chunkArray<T>(arr: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Process a single set in a single language, inserting PriceHistory for each matching DB card.
 * Returns `true` if successful, or `false` if something failed.
 */
async function processOneSetAndLanguage(
  ksContext: any,
  set: any,
  language: string,
  counters: {
    totalPriceEntriesInserted: number;
    totalCardsWithoutDbMatch: number;
    unmatchedCardIds: string[];
  },
): Promise<boolean> {
  serverLog(
    `\n⏳ Fetching price data for set: ${set.name} (TCG Code: ${set.tcgSetId}, Lang: ${language})`,
  );

  try {
    // We'll create a date truncated to midnight for "one entry per day"
    const priceDate = new Date();
    priceDate.setUTCHours(0, 0, 0, 0);

    // 1) Fetch card data from external TCG API
    const cardsData = await fetchPokemonTcgApiSetCards(language, set.tcgSetId);
    if (!Array.isArray(cardsData) || cardsData.length === 0) {
      serverLog(
        "warn",
        `⚠️ No card data returned for set: ${set.tcgSetId}, language: ${language}`,
      );
      return false;
    }

    // 2) For each fetchedCard, find matching DB cards and insert PriceHistory entries
    await Promise.all(
      cardsData.map((fetchedCard) =>
        limitCardLevel(async () => {
          const matchingDbCards = await ksContext.db.PokemonCard.findMany({
            where: {
              tcgCardId: { equals: fetchedCard.id },
              set: { id: { equals: set.id } },
              language: { equals: language },
            },
          });

          if (matchingDbCards.length === 0) {
            counters.totalCardsWithoutDbMatch++;
            counters.unmatchedCardIds.push(fetchedCard.id);
            return;
          }

          // Insert one PriceHistory entry per matchingDbCard
          for (const dbCard of matchingDbCards) {
            await ksContext.db.PokemonCardPriceHistory.createOne({
              data: {
                card: { connect: { id: dbCard.id } },
                variant: dbCard.variant,
                fetchedAt: new Date(),
                tcgplayerData: fetchedCard.tcgplayer ?? null,
                cardmarketData: fetchedCard.cardmarket ?? null,
                priceDate,
              },
            });
            counters.totalPriceEntriesInserted++;
          }
        }),
      ),
    );

    serverLog(
      `✅ Finished inserting price data for set: ${set.name} (Lang: ${language})`,
    );
    return true;
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
 * Processes an entire set (across all languages).
 * If ANY card fails in ANY language, we consider the whole set failed.
 */
async function processEntireSet(
  ksContext: any,
  set: any,
  counters: {
    totalPriceEntriesInserted: number;
    totalCardsWithoutDbMatch: number;
    unmatchedCardIds: string[];
  },
): Promise<boolean> {
  try {
    // Process all supported languages in parallel (or sequentially if you prefer).
    const results = await Promise.all(
      POKEMON_SUPPORTED_LANGUAGES.map((language) =>
        processOneSetAndLanguage(ksContext, set, language, counters),
      ),
    );

    // If ANY language returned false, the entire set is considered a failure.
    const allLanguagesSucceeded = results.every((r) => r === true);
    if (!allLanguagesSucceeded) {
      serverLog(
        "warn",
        `⚠️ Some language failed for set: ${set.name}; not updating lastPriceFetchDate.`,
      );
      return false;
    }

    serverLog(`✅ All languages succeeded for set: ${set.name}`);
    return true;
  } catch (err) {
    serverLog("error", `❌ Error in processEntireSet for: ${set.name}`, err);
    return false;
  }
}

/**
 * Main function to fetch and store Pokemon card prices for multiple sets.
 */
export async function fetchAndStorePokemonCardPrices() {
  const ksContext = await getKeystoneContext({ sudo: true });
  const counters = {
    totalPriceEntriesInserted: 0,
    totalCardsWithoutDbMatch: 0,
    unmatchedCardIds: [] as string[],
  };

  let totalSetsProcessed = 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    serverLog("info", "=== Starting fetchAndStorePokemonCardPrices ===");

    // 1) Fetch sets that need price updates (none updated yet or last updated before today)
    const sets = await ksContext.db.PokemonSet.findMany({
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

    if (sets.length === 0) {
      serverLog("info", "✅ No sets left to update. Already done for today.");
      return;
    }

    // 2) Process sets in concurrency-limited batches
    const setChunks = chunkArray(sets, SET_CONCURRENCY_LIMIT);
    let anySetFailed = false;

    for (const setChunk of setChunks) {
      // Process each set in parallel, but track success/failure individually
      const chunkResults = await Promise.all(
        setChunk.map(async (set) => {
          const success = await processEntireSet(ksContext, set, counters);
          totalSetsProcessed++;
          return { set, success };
        }),
      );

      // 3) Update lastPriceFetchDate only for sets that fully succeeded
      const successfulSetsIds = chunkResults
        .filter((r) => r.success)
        .map((r) => r.set.id);

      if (successfulSetsIds.length > 0) {
        await ksContext.prisma.pokemonSet.updateMany({
          where: { id: { in: successfulSetsIds } },
          data: {
            lastPriceFetchDate: new Date(),
          },
        });
        serverLog(
          "info",
          "✅✅✅ All sets in batch have been successfully updated.",
        );
      }

      // If any set in this chunk failed, note that
      if (chunkResults.some((r) => !r.success)) {
        anySetFailed = true;
      }

      // Optional short delay between chunks
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 4) Summary logs
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
        "⚠️ Some sets failed and will be retried on the next run.",
      );
    } else {
      serverLog("info", "✅ All sets successfully updated!");
    }
  } catch (error) {
    serverLog("error", "❌ Error in fetchAndStorePokemonCardPrices:", error);
    process.exit(1);
  } finally {
    await ksContext.prisma.$disconnect();
    serverLog("👋 Done with price update script.");
  }
}

// If this file is called directly via `ts-node`, run the main function:
if (require.main === module) {
  fetchAndStorePokemonCardPrices().catch((error) => {
    serverLog(
      "error",
      "❌ Fatal error in fetchAndStorePokemonCardPrices:",
      error,
    );
    process.exit(1);
  });
}
