import { fetchPokemonTcgApiSetCards } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "@/utils/customLog";
import { prisma } from "@/lib/prisma";
import pLimit from "p-limit";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";

// Command line arguments (optional)
const args = process.argv.slice(2);
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

// Concurrency settings
const SET_CONCURRENCY_LIMIT = 5; // how many sets are processed in parallel
const CARD_CONCURRENCY_LIMIT = 10; // concurrency for handling price history within each set
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
    unmatchedCardIds: string[]; // <-- NEW: we store card IDs not found in DB
  },
) {
  customLog(
    `\n⏳ Fetching price data for set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );

  // 1) Fetch external cards from the Pokémon TCG API
  let cardsData: any[];
  try {
    cardsData = await fetchPokemonTcgApiSetCards(language, set.setId);
    if (!Array.isArray(cardsData)) {
      customLog(
        "warn",
        `⚠️ No card data returned for set: ${set.setId}, language: ${language}`,
      );
      return;
    }
  } catch (error) {
    customLog(
      "error",
      `❌ Failed to fetch card data for set ${set.setId}, language: ${language}`,
      error,
    );
    return;
  }

  // 2) Optional filter by a specific cardId
  if (specifiedCardId) {
    cardsData = cardsData.filter((c) => c.id === specifiedCardId);
    if (cardsData.length === 0) {
      customLog(
        "warn",
        `⚠️ No fetched card matches --cardId=${specifiedCardId}. Skipping.`,
      );
      return;
    } else {
      customLog(`🎯 Filtering for only specified cardId: ${specifiedCardId}`);
    }
  }

  // 3) For each fetched card, find all matching DB variants and create a PriceHistory row
  const priceTasks: Array<Promise<void>> = [];

  for (const fetchedCard of cardsData) {
    const externalCardId = fetchedCard.id;

    priceTasks.push(
      limitCardLevel(async () => {
        try {
          // We find all matching DB cards (one for each variant) by:
          //   - same external cardId
          //   - same setId (internal PK: set.id)
          //   - same language
          const matchingDbCards = await prisma.pokemonCard.findMany({
            where: {
              cardId: externalCardId,
              setId: set.id,
              language,
            },
          });

          if (matchingDbCards.length === 0) {
            counters.totalCardsWithoutDbMatch++;
            counters.unmatchedCardIds.push(externalCardId); // <-- store for summary
            customLog(
              "warn",
              `⚠️ No matching DB cards found for externalCardId=${externalCardId}, setId=${set.id}, language=${language}`,
            );
            return;
          }

          // 3.1 For each matching DB variant, create a new PriceHistory row
          for (const dbCard of matchingDbCards) {
            await prisma.pokemonCardPriceHistory.create({
              data: {
                // Required fields
                cardId: dbCard.id, // references the PokemonCard PK
                variant: dbCard.variant, // match the variant in the DB
                fetchedAt: new Date(), // explicitly set fetched time

                // Full JSON objects
                tcgplayerData: fetchedCard.tcgplayer
                  ? { ...fetchedCard.tcgplayer }
                  : null,
                cardmarketData: fetchedCard.cardmarket
                  ? { ...fetchedCard.cardmarket }
                  : null,
              },
            });

            counters.totalPriceEntriesInserted++;
            customLog(
              `💾 Inserted price history for DB card variant [${dbCard.variant}] (cardId: ${dbCard.id})`,
            );
          }
        } catch (err) {
          customLog(
            "error",
            `❌ Error creating price history for externalCardId=${externalCardId}`,
            err,
          );
        }
      }),
    );
  }

  // 4) Wait until all price insertions are done
  await Promise.all(priceTasks);

  customLog(
    `✅ Finished price data for set: ${set.name} (TCG Code: ${set.setId}, Lang: ${language})`,
  );
}

/**
 * Main function:
 *  - Fetch all sets from your DB (or filter by --setId).
 *  - For each set + each language, fetch cards from TCG API and create price history.
 *  - Summarize results.
 */
export async function fetchAndStorePokemonPrices() {
  const counters = {
    totalPriceEntriesInserted: 0,
    totalCardsWithoutDbMatch: 0,
    unmatchedCardIds: [] as string[],
  };
  let totalSetsProcessed = 0;

  try {
    // 1) Fetch all sets from DB
    let sets = await prisma.pokemonSet.findMany();
    customLog(`🔍 Found ${sets.length} sets in the database.`);

    // 2) Optional filter by setId
    if (specifiedSetId) {
      sets = sets.filter((s) => s.setId === specifiedSetId);
      if (sets.length === 0) {
        customLog(
          "warn",
          `⚠️ No sets match --setId=${specifiedSetId}. Exiting.`,
        );
        return;
      } else {
        customLog(`🎯 Filtering for only setId=${specifiedSetId}`);
      }
    }

    // 3) Split sets into chunks, process up to SET_CONCURRENCY_LIMIT in parallel
    const setChunks = chunkArray(sets, SET_CONCURRENCY_LIMIT);

    for (const setChunk of setChunks) {
      await Promise.all(
        setChunk.flatMap((set) => {
          // We also handle multiple languages in parallel
          return POKEMON_SUPPORTED_LANGUAGES.map((language) =>
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
          );
        }),
      );
    }

    // 4) Final summary
    customLog("\n--- Price Insertion Summary ---");
    customLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    customLog(
      `💰 Total PriceHistory Entries Inserted: ${counters.totalPriceEntriesInserted}`,
    );
    customLog(
      `❓ Total Fetched Cards with No Matching DB Card: ${counters.totalCardsWithoutDbMatch}`,
    );

    // 5) If any card IDs had no DB match, list them:
    if (counters.unmatchedCardIds.length > 0) {
      customLog(
        "warn",
        `🔎 The following externalCardIds were fetched but not found in DB:\n   ${counters.unmatchedCardIds.join(
          ", ",
        )}`,
      );
    }
  } catch (error) {
    customLog("error", "❌ Error during fetching and storing prices", error);
  } finally {
    await prisma.$disconnect();
  }
}

// For direct CLI usage: `ts-node fetchAndStorePokemonPrices.ts`
if (require.main === module) {
  fetchAndStorePokemonPrices().catch((error) => {
    customLog("error", "❌ Error in fetchAndStorePokemonPrices script:", error);
    process.exit(1);
  });
}
