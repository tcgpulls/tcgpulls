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

// Concurrency for (language + set) tasks
const CONCURRENCY_LIMIT = 5; // Adjust as you like
const limitSetLevel = pLimit(CONCURRENCY_LIMIT);

// Concurrency for card upserts
const CARD_CONCURRENCY_LIMIT = 10; // concurrency for each set's cards
const limitCardLevel = pLimit(CARD_CONCURRENCY_LIMIT);

/**
 * Extracts the numeric portion of a string (e.g., "HHGS13" → 13).
 * Non-numeric values return Number.MAX_SAFE_INTEGER to push them to the end.
 */
function normalizeNumber(numStr: string): number {
  const match = numStr.match(/\d+/); // Match numeric part
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

async function fetchAndStorePokemonSetCards() {
  let totalSetsProcessed = 0;
  let totalCardsInserted = 0;
  let totalCardsSkipped = 0; // unused but preserved for logging parity or future usage

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

    // 3) Build an array of tasks for every (language + set) combo
    const allSetLanguageTasks: Array<() => Promise<void>> = [];

    for (const language of POKEMON_SUPPORTED_LANGUAGES) {
      for (const set of sets) {
        // Each combo is wrapped in a function we can pass to limitSetLevel
        allSetLanguageTasks.push(async () => {
          customLog(
            `🚀 Processing set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
          );

          // Fetch cards from external API
          let cardsData;
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

          // If user specified a particular cardId, filter
          if (specifiedCardId) {
            cardsData = cardsData.filter(
              (card: any) => card.id === specifiedCardId,
            );
            if (cardsData.length === 0) {
              customLog(
                "warn",
                `⚠️ No cards found matching specified cardId: ${specifiedCardId}`,
              );
            } else {
              customLog(
                `🎯 Processing only specified card: ${specifiedCardId}`,
              );
            }
          }

          // We'll gather concurrency tasks for the cards
          const cardTasks: Array<Promise<void>> = [];

          // 4) For each card in this set+language
          for (const card of cardsData) {
            const hp =
              card.hp && !isNaN(parseInt(card.hp)) ? parseInt(card.hp) : null;
            const convertedRetreatCost = card.convertedRetreatCost ?? null;

            // Calculate normalized number
            const normalizedNumber = normalizeNumber(card.number);

            // Base fields referencing the internal set.id and external cardId
            const baseCardData = {
              setId: set.id, // internal PK of PokemonSet
              cardId: card.id, // external TCG code
              name: card.name,
              supertype: card.supertype,
              subtypes: card.subtypes || [],
              hp,
              types: card.types || [],
              evolvesFrom: card.evolvesFrom || null,
              flavorText: card.flavorText || null,
              number: card.number,
              normalizedNumber, // Store normalized number
              artist: card.artist || null,
              rarity: card.rarity || null,
              nationalPokedexNumbers: card.nationalPokedexNumbers || [],
              imagesSmall: card.images?.small || "",
              imagesLarge: card.images?.large || "",
              retreatCost: card.retreatCost || [],
              convertedRetreatCost,
              language,
            };

            // Figure out variant keys from TCGPlayer
            const variantKeys = card.tcgplayer?.prices
              ? Object.keys(card.tcgplayer.prices)
              : [];
            const allVariants =
              variantKeys.length === 0 ? ["normal"] : variantKeys;

            // 5) For each variant, upsert in concurrency
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

                    const attacksData = (card.attacks || []).map(
                      (attack: any) => ({
                        name: attack.name,
                        cost: attack.cost || [],
                        convertedEnergyCost: attack.convertedEnergyCost,
                        damage: attack.damage || null,
                        text: attack.text || null,
                      }),
                    );

                    const weaknessesData = (card.weaknesses || []).map(
                      (weakness: any) => ({
                        type: weakness.type,
                        value: weakness.value,
                      }),
                    );

                    // Upsert by (cardId, language, setId, variant)
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
                    totalCardsInserted++;
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

          // Wait for all card-level tasks (with concurrency)
          await Promise.all(cardTasks);

          totalSetsProcessed++;
          customLog(
            `🎯 Finished processing set: ${set.name} (TCG Code: ${set.setId}, Language: ${language})`,
          );
        });
      }
    }

    // 5) Concurrency for all (language + set) tasks
    await Promise.all(allSetLanguageTasks.map((task) => limitSetLevel(task)));

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
