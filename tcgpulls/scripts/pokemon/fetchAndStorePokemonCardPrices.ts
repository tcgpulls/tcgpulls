import { fetchPokemonTcgApiSetCards } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "@/utils/customLog";
import { prisma } from "@/lib/prisma";
import pLimit from "p-limit";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";
import { Prisma } from "@prisma/client";
import PokemonCardPriceHistoryCreateManyInput = Prisma.PokemonCardPriceHistoryCreateManyInput;

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
    unmatchedCardIds: string[];
  },
) {
  customLog(
    `\n⏳ Fetching price data for set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );

  try {
    // 1. Fetch external cards from the Pokémon TCG API
    const cardsData = await fetchPokemonTcgApiSetCards(language, set.setId);
    if (!Array.isArray(cardsData) || cardsData.length === 0) {
      customLog(
        "warn",
        `⚠️ No card data returned for set: ${set.setId}, language: ${language}`,
      );
      return;
    }

    // 2. Filter by specifiedCardId if applicable
    const filteredCardsData = specifiedCardId
      ? cardsData.filter((c) => c.id === specifiedCardId)
      : cardsData;

    if (filteredCardsData.length === 0) {
      customLog(
        "warn",
        `⚠️ No cards match specifiedCardId=${specifiedCardId}. Skipping.`,
      );
      return;
    }

    // 3. Use pLimit for processing each fetched card
    const limitCardLevel = pLimit(CARD_CONCURRENCY_LIMIT);
    const priceHistoryEntries: PokemonCardPriceHistoryCreateManyInput[] = []; // Collect entries for batch insertion

    await Promise.all(
      filteredCardsData.map((fetchedCard) =>
        limitCardLevel(async () => {
          const externalCardId = fetchedCard.id;

          // Find matching DB cards
          const matchingDbCards = await prisma.pokemonCard.findMany({
            where: {
              cardId: externalCardId,
              setId: set.id,
              language,
            },
          });

          if (matchingDbCards.length === 0) {
            counters.totalCardsWithoutDbMatch++;
            counters.unmatchedCardIds.push(externalCardId);
            customLog(
              "warn",
              `⚠️ No matching DB cards for externalCardId=${externalCardId}, setId=${set.id}, language=${language}`,
            );
            return;
          }

          // Create price history entries for each matching card
          for (const dbCard of matchingDbCards) {
            priceHistoryEntries.push({
              cardId: dbCard.id,
              variant: dbCard.variant,
              fetchedAt: new Date(),
              tcgplayerData: fetchedCard.tcgplayer
                ? { ...fetchedCard.tcgplayer }
                : null,
              cardmarketData: fetchedCard.cardmarket
                ? { ...fetchedCard.cardmarket }
                : null,
            });
          }
        }),
      ),
    );

    // 4. Use a single transaction to insert all data for this language
    if (priceHistoryEntries.length > 0) {
      await prisma.$transaction([
        prisma.pokemonCardPriceHistory.createMany({
          data: priceHistoryEntries,
        }),
      ]);

      counters.totalPriceEntriesInserted += priceHistoryEntries.length;
      customLog(
        `💾 Successfully inserted ${priceHistoryEntries.length} price history entries for set ${set.name} (${language})`,
      );
    }
  } catch (error) {
    customLog(
      "error",
      `❌ Error processing set ${set.name} (Language: ${language})`,
      error,
    );
  }
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
