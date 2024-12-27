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
const SET_CONCURRENCY_LIMIT = 3; // Adjusted for smaller batches
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
 * Main function:
 *  - Fetch all sets from your DB (or filter by --setId).
 *  - Process them in chunks to avoid long-running queries.
 */
export async function fetchAndStorePokemonPrices() {
  const counters = {
    totalPriceEntriesInserted: 0,
    totalCardsWithoutDbMatch: 0,
    unmatchedCardIds: [] as string[],
  };
  let totalSetsProcessed = 0;

  try {
    const sets = await prisma.pokemonSet.findMany();
    customLog(`🔍 Found ${sets.length} sets in the database.`);

    const filteredSets = specifiedSetId
      ? sets.filter((s) => s.setId === specifiedSetId)
      : sets;

    if (filteredSets.length === 0) {
      customLog("warn", `⚠️ No sets match --setId=${specifiedSetId}. Exiting.`);
      return;
    }

    const setChunks = chunkArray(filteredSets, SET_CONCURRENCY_LIMIT);
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

if (require.main === module) {
  fetchAndStorePokemonPrices().catch((error) => {
    customLog("error", "❌ Error in fetchAndStorePokemonPrices script:", error);
    process.exit(1);
  });
}
