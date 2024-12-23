import { fetchPokemonTcgApiSetCards } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "@/utils/customLog";
import { prisma } from "@/lib/prisma";
import pLimit from "p-limit";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";

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
 * Extracts the numeric portion of a string (e.g., "HHGS13" → 13).
 * Non-numeric values return Number.MAX_SAFE_INTEGER to push them to the end.
 */
function normalizeNumber(numStr: string): number {
  const match = numStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

// Utility to chunk an array into smaller arrays (batches) of given size
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

async function processOneSetAndLanguage(
  set: any,
  language: string,
  specifiedCardId?: string | null,
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
      normalizedNumber, // normalized
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
              customLog(
                `🔄 Updating existing card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );
            } else {
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
  let totalSetsProcessed = 0;
  let totalCardsInserted = 0; // If you need a count, you can track it in the upsert logic or code
  let totalCardsSkipped = 0; // Unused but you can implement logic for skipping

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
    // We'll break the sets into groups of CONCURRENCY_LIMIT.
    const setChunks = chunkArray(sets, CONCURRENCY_LIMIT);

    for (const setChunk of setChunks) {
      // For each chunk, we process sets in parallel (up to CONCURRENCY_LIMIT),
      // but we do not move on to the next chunk until all of these finish.
      await Promise.all(
        setChunk.flatMap((set) => {
          // We do a .flatMap() because we also want to process multiple languages in parallel
          return POKEMON_SUPPORTED_LANGUAGES.map(async (language) => {
            await processOneSetAndLanguage(set, language, specifiedCardId);
            totalSetsProcessed++;
          });
        }),
      );
    }

    // Final Summary
    customLog("\n--- Card Insertion Summary ---");
    customLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    customLog(`✅ Total Cards Inserted: ${totalCardsInserted}`);
    customLog(`⏭️ Total Cards Skipped: ${totalCardsSkipped}`);
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
