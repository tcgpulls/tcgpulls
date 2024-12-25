import { fetchPokemonTcgApiSetCards } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "@/utils/customLog";
import { prisma } from "@/lib/prisma";
import pLimit from "p-limit";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";
import { SPELLED_NUMBERS } from "@/constants/utils";

// Command line arguments
const args = process.argv.slice(2);
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

const CONCURRENCY_LIMIT = 5; // <= This is how many sets are processed in parallel
const CARD_CONCURRENCY_LIMIT = 10; // <= concurrency for upserting cards within each set
const limitCardLevel = pLimit(CARD_CONCURRENCY_LIMIT);

/**
 * Replaces the old normalizeNumber with a "smart" version:
 * 1. If there's a digit, parse it.
 * 2. Else check spelled-out words (ONE, TWO, etc.).
 * 3. Else handle single/multi-letter codes (e.g. "A"→1, "B"→2, "AA"→27).
 * 4. Else fallback to 9999.
 */
function normalizeNumber(numStr: string): number {
  // 1) Check if there's a standard digit inside
  const numericMatch = numStr.match(/\d+/);
  if (numericMatch) {
    return parseInt(numericMatch[0], 10);
  }

  // Convert to uppercase for spelled-numbers or letter handling
  const upper = numStr.toUpperCase();

  // 2) Check spelled-out mapping, e.g. "ONE", "TWO", etc.
  if (SPELLED_NUMBERS[upper] !== undefined) {
    return SPELLED_NUMBERS[upper];
  }

  // 3) Single letter scenario, like "A", "B", "E"
  if (/^[A-Z]$/.test(upper)) {
    return upper.charCodeAt(0) - 64; // 'A' = 65 → 1, 'B' = 66 → 2, ...
  }

  // 3b) Multi-letter scenario, e.g. "AA" → 27, "AB" → 28
  if (/^[A-Z]+$/.test(upper)) {
    let result = 0;
    for (const ch of upper) {
      const val = ch.charCodeAt(0) - 64; // 'A'=1 ... 'Z'=26
      result = result * 26 + val;
    }
    return result;
  }

  // 4) Fallback if all else fails
  return 9999;
}

// Utility to chunk an array into smaller arrays (batches) of given size
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Processes a single set for a given language, optionally for a single cardId.
 * Fetches the external cards, upserts them into PokemonCard, and logs any errors.
 */
async function processOneSetAndLanguage(
  set: any,
  language: string,
  specifiedCardId: string | null | undefined,
  counters: {
    totalCardsInserted: number;
    totalCardsSkipped: number;
    errorCardIds: string[];
  },
) {
  customLog(
    `\n🚀 Processing set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );

  // 1) Fetch external cards
  let cardsData: any[];
  try {
    cardsData = await fetchPokemonTcgApiSetCards(language, set.setId);
    if (!Array.isArray(cardsData)) {
      customLog(
        "warn",
        `⚠️ No cards data returned for set: ${set.setId} in language: ${language}`,
      );
      return;
    }
  } catch (error) {
    customLog(
      "error",
      `❌ Failed to fetch cards for set ${set.setId} (Language: ${language})`,
      error,
    );
    return;
  }

  // 2) Optional filter by cardId
  if (specifiedCardId) {
    cardsData = cardsData.filter((card) => card.id === specifiedCardId);
    if (cardsData.length === 0) {
      customLog(
        "warn",
        `⚠️ No cards found matching specified cardId: ${specifiedCardId}`,
      );
    } else {
      customLog(`🎯 Processing only specified card: ${specifiedCardId}`);
    }
  }

  // 3) Build all card upsert tasks for concurrency-limited execution
  const cardTasks: Array<Promise<void>> = [];

  for (const card of cardsData) {
    const hp = card.hp && !isNaN(parseInt(card.hp)) ? parseInt(card.hp) : null;
    const convertedRetreatCost = card.convertedRetreatCost ?? null;
    const normalizedNumber = normalizeNumber(card.number);

    const baseCardData = {
      setId: set.id, // internal PK
      cardId: card.id, // external TCG code
      name: card.name,
      supertype: card.supertype,
      subtypes: card.subtypes || [],
      hp,
      types: card.types || [],
      evolvesFrom: card.evolvesFrom || null,
      flavorText: card.flavorText || null,
      number: card.number,
      normalizedNumber, // replaced to the new logic
      artist: card.artist || null,
      rarity: card.rarity || null,
      nationalPokedexNumbers: card.nationalPokedexNumbers || [],
      imagesSmall: card.images?.small || "",
      imagesLarge: card.images?.large || "",
      retreatCost: card.retreatCost || [],
      convertedRetreatCost,
      language,
    };

    // TCGPlayer variant keys
    const variantKeys = card.tcgplayer?.prices
      ? Object.keys(card.tcgplayer.prices)
      : [];
    const allVariants = variantKeys.length === 0 ? ["normal"] : variantKeys;

    for (const variantKey of allVariants) {
      cardTasks.push(
        limitCardLevel(async () => {
          try {
            const existingCard = await prisma.pokemonCard.findUnique({
              where: {
                cardId_language_setId_variant: {
                  cardId: card.id,
                  language,
                  setId: set.id,
                  variant: variantKey,
                },
              },
            });

            if (existingCard) {
              // We are updating (so "skipping" a new insert)
              counters.totalCardsSkipped++;
              customLog(
                `🔄 Updating existing card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );
            } else {
              // We are creating a new card
              counters.totalCardsInserted++;
              customLog(
                `✨ Creating new card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );
            }

            const abilitiesData = (card.abilities || []).map(
              (ability: any) => ({
                name: ability.name,
                text: ability.text,
                type: ability.type,
              }),
            );

            const attacksData = (card.attacks || []).map((attack: any) => ({
              name: attack.name,
              cost: attack.cost || [],
              convertedEnergyCost: attack.convertedEnergyCost,
              damage: attack.damage || null,
              text: attack.text || null,
            }));

            const weaknessesData = (card.weaknesses || []).map(
              (weakness: any) => ({
                type: weakness.type,
                value: weakness.value,
              }),
            );

            await prisma.pokemonCard.upsert({
              where: {
                cardId_language_setId_variant: {
                  cardId: card.id,
                  language,
                  setId: set.id,
                  variant: variantKey,
                },
              },
              update: {
                ...baseCardData,
                variant: variantKey,
                abilities: { create: abilitiesData },
                attacks: { create: attacksData },
                weaknesses: { create: weaknessesData },
              },
              create: {
                ...baseCardData,
                variant: variantKey,
                abilities: { create: abilitiesData },
                attacks: { create: attacksData },
                weaknesses: { create: weaknessesData },
              },
            });

            customLog(
              `✅ Upserted card: ${set.name} - ${card.name} (${variantKey})`,
            );
          } catch (insertError) {
            // If there's an error, we track which card ID it failed on
            counters.errorCardIds.push(card.id);
            customLog(
              "error",
              `❌ Error inserting card: ${set.name} - ${card.name} (${variantKey}) (cardId: ${card.id})`,
              insertError,
            );
          }
        }),
      );
    }
  }

  // 4) Wait until all card upserts for this set are done
  await Promise.all(cardTasks);

  customLog(
    `🎯 Finished processing set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
  );
}

async function fetchAndStorePokemonSetCards() {
  // Keep counters here so we can display final totals
  let totalSetsProcessed = 0;
  const counters = {
    totalCardsInserted: 0,
    totalCardsSkipped: 0,
    errorCardIds: [] as string[], // <--- NEW: track which cardIDs had errors
  };

  try {
    // 1) Fetch all sets from DB
    let sets = await prisma.pokemonSet.findMany();
    customLog(`🔍 Found ${sets.length} sets in the database.`);

    // 2) Optional filtering by setId
    if (specifiedSetId) {
      sets = sets.filter((s) => s.setId === specifiedSetId);
      if (sets.length === 0) {
        customLog(
          "warn",
          `⚠️ No sets found matching specified setId: ${specifiedSetId}`,
        );
      } else {
        customLog(`🎯 Processing only specified set: ${specifiedSetId}`);
      }
    }

    // -- Here is where we do a "chunked" approach for concurrency of sets. --
    const setChunks = chunkArray(sets, CONCURRENCY_LIMIT);

    for (const setChunk of setChunks) {
      // For each chunk, we process sets in parallel (up to CONCURRENCY_LIMIT),
      // but do not move on to the next chunk until all are finished.
      await Promise.all(
        setChunk.flatMap((set) => {
          // .flatMap() because we process multiple languages in parallel too
          return POKEMON_SUPPORTED_LANGUAGES.map(async (language) => {
            await processOneSetAndLanguage(
              set,
              language,
              specifiedCardId,
              counters,
            );
            totalSetsProcessed++;
          });
        }),
      );
    }

    // Final Summary
    customLog("\n--- Card Insertion Summary ---");
    customLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    customLog(`✅ Total Cards Inserted: ${counters.totalCardsInserted}`);
    customLog(`⏭️ Total Cards Skipped: ${counters.totalCardsSkipped}`);

    // If any cards had errors, list them
    if (counters.errorCardIds.length > 0) {
      customLog(
        "warn",
        `❌ The following external card IDs had insert/upsert errors:\n   ${counters.errorCardIds.join(
          ", ",
        )}`,
      );
    }
  } catch (error) {
    customLog("error", "❌ Error during fetching and storing cards", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Entry point
fetchAndStorePokemonSetCards().catch((error) => {
  customLog("error", "❌ Error in fetchAndStorePokemonSetCards script:", error);
  process.exit(1);
});
