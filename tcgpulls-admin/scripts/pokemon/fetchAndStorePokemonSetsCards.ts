import "dotenv/config";
import pLimit from "p-limit";

// Import your Keystone context creator
import getKeystoneContext from "../../getKeystoneContext";
import { SPELLED_NUMBERS } from "../../constants/utils";
import serverLog from "../../utils/serverLog";
import { fetchPokemonTcgApiSetCards } from "../../lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import {
  POKEMON_R2_STORAGE_PATH,
  POKEMON_SUPPORTED_LANGUAGES,
} from "../../constants/tcg/pokemon";
import {
  PokemonCardAbility,
  PokemonCardAttack,
  PokemonCardResistance,
  PokemonCardWeakness,
} from ".prisma/client";

// Command line arguments
const args = process.argv.slice(2);
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

// Concurrency limits
const SET_CONCURRENCY_LIMIT = process.env.POKEMON_SETS_CONCURRENCY
  ? parseInt(process.env.POKEMON_SETS_CONCURRENCY, 10)
  : 10; // how many sets are processed in parallel
const CARD_CONCURRENCY_LIMIT = process.env.POKEMON_CARDS_CONCURRENCY
  ? parseInt(process.env.POKEMON_CARDS_CONCURRENCY, 10)
  : 10; // how many card upserts per set in parallel

/**
 * Replaces the old `normalizeNumber` logic with a "smart" version:
 *   1) If there's a digit, parse it.
 *   2) Else check spelled-out words (ONE, TWO, etc.).
 *   3) Else handle single/multi-letter codes (e.g. "A"→1, "B"→2, "AA"→27).
 *   4) Else fallback to 9999.
 */
function normalizeNumber(numStr: string): number {
  // 1) Standard digit?
  const numericMatch = numStr.match(/\d+/);
  if (numericMatch) {
    return parseInt(numericMatch[0], 10);
  }

  // 2) Check spelled-out mapping
  const upper = numStr.toUpperCase();
  if (SPELLED_NUMBERS[upper] !== undefined) {
    return SPELLED_NUMBERS[upper];
  }

  // 3) Single letter e.g. "A", "B" => 1, 2
  if (/^[A-Z]$/.test(upper)) {
    return upper.charCodeAt(0) - 64; // 'A'=65 => 1
  }

  // 3b) Multi-letter e.g. "AA" => 27, "AB" => 28, etc.
  if (/^[A-Z]+$/.test(upper)) {
    let result = 0;
    for (const ch of upper) {
      const val = ch.charCodeAt(0) - 64;
      result = result * 26 + val;
    }
    return result;
  }

  // 4) Fallback
  return 9999;
}

/**
 * Utility to chunk an array into batches of given size
 */
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Handles fetching TCG data for a single set + language,
 * then creates or updates the cards in Keystone.
 */
async function processOneSetAndLanguage(
  ksContext: any,
  set: any,
  language: string,
  specifiedCardId: string | null,
  counters: {
    totalCardsInserted: number;
    totalCardsSkipped: number; // We'll reuse this for "updates" to keep it minimal
    errorCardIds: string[];
  },
) {
  serverLog(
    `\n🚀 Processing set: ${set.name} (TCG Code: ${set.tcgSetId}, Language: ${language})`,
  );
  // 1) Fetch external cards
  let cardsData: any[];
  try {
    cardsData = await fetchPokemonTcgApiSetCards(language, set.tcgSetId);
    if (!Array.isArray(cardsData)) {
      serverLog(
        "warn",
        `⚠️ No cards data returned for set: ${set.tcgSetId} in language: ${language}`,
      );
      return;
    }
  } catch (error) {
    serverLog(
      "error",
      `❌ Failed to fetch cards for set ${set.tcgSetId} (Language: ${language})`,
      error,
    );
    return;
  }

  // 2) If user specified a single cardId via CLI, filter
  if (specifiedCardId) {
    cardsData = cardsData.filter((card) => card.id === specifiedCardId);
    if (cardsData.length === 0) {
      serverLog(
        "warn",
        `⚠️ No cards found matching specified cardId: ${specifiedCardId}`,
      );
    } else {
      serverLog(`🎯 Processing only specified card: ${specifiedCardId}`);
    }
  }

  // 3) Concurrency-limited tasks for each card variant
  const limitCardLevel = pLimit(CARD_CONCURRENCY_LIMIT);
  const cardTasks: Array<Promise<void>> = [];

  for (const card of cardsData) {
    const hp =
      card.hp && !isNaN(parseInt(card.hp)) ? parseInt(card.hp, 10) : null;
    const convertedRetreatCost = card.convertedRetreatCost ?? null;
    const normalizedNumber = normalizeNumber(card.number);

    // TCGPlayer variant keys
    // If there's no price data, default to "normal"
    const variantKeys = card.tcgplayer?.prices
      ? Object.keys(card.tcgplayer.prices)
      : [];
    const allVariants = variantKeys.length === 0 ? ["normal"] : variantKeys;

    for (const variantKey of allVariants) {
      cardTasks.push(
        limitCardLevel(async () => {
          // We'll combine: cardId + language + variant => unique
          const tcgCardId_variant_language = `${card.id}-${variantKey}-${language}`;

          try {
            // 1) Check if card already exists
            const existingCard = await ksContext.db.PokemonCard.findOne({
              where: { tcgCardId_variant_language },
              query: `
                id
              `,
            });

            if (!existingCard) {
              // ***** NO CHANGE: Create new card if none exist
              counters.totalCardsInserted++;
              serverLog(
                `✨ Creating new card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );

              // Prepare child relationships
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
                damage: attack.damage ?? null,
                text: attack.text ?? null,
              }));

              const weaknessesData = (card.weaknesses || []).map(
                (weakness: any) => ({
                  type: weakness.type,
                  value: weakness.value,
                }),
              );

              const resistancesData = (card.resistances || []).map(
                (resistance: any) => ({
                  type: resistance.type,
                  value: resistance.value,
                }),
              );

              // We'll store images in: img/tcg/pokemon/sets/{language}/{tcgSetId}/cards/...
              const baseImagePath = `${POKEMON_R2_STORAGE_PATH}/sets/${set.language}/${set.tcgSetId}/cards`;
              const baseImageName = `${card.id}-${variantKey}`;

              await ksContext.db.PokemonCard.createOne({
                data: {
                  name: card.name,
                  tcgCardId: card.id,
                  tcgSetId: card.set?.id || set.tcgSetId,
                  language,
                  tcgCardId_variant_language,
                  variant: variantKey,
                  supertype: card.supertype || "Unknown",
                  subtypes: card.subtypes || [],
                  hp,
                  types: card.types || [],
                  evolvesFrom: card.evolvesFrom || "",
                  flavorText: card.flavorText || "",
                  number: card.number,
                  normalizedNumber,
                  artist: card.artist || "",
                  rarity: card.rarity || "",
                  nationalPokedexNumbers: card.nationalPokedexNumbers || [],
                  imageSmallApiUrl: card.images?.small || "",
                  imageLargeApiUrl: card.images?.large || "",
                  imageSmallStorageUrl: `${baseImagePath}/${baseImageName}-small.jpg`,
                  imageLargeStorageUrl: `${baseImagePath}/${baseImageName}-large.jpg`,
                  retreatCost: card.retreatCost || [],
                  convertedRetreatCost,
                  // Link to the parent set
                  set: {
                    connect: {
                      id: set.id,
                    },
                  },
                  // Create child items in one go
                  abilities: {
                    create: abilitiesData,
                  },
                  attacks: {
                    create: attacksData,
                  },
                  weaknesses: {
                    create: weaknessesData,
                  },
                  resistances: {
                    create: resistancesData,
                  },
                },
              });

              serverLog(
                `✅ Created new card: ${set.name} - ${card.name} (${variantKey})`,
              );
            } else {
              // ***** CHANGED/ADDED: If the card *does* exist, update it
              counters.totalCardsSkipped++; // reuse "skipped" as "updated"
              serverLog(
                `🔄 Updating existing card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );

              // 1) Fetch existing children so we only add new ones
              const [
                existingAbilities,
                existingAttacks,
                existingWeaknesses,
                existingResistances,
              ] = await Promise.all([
                ksContext.db.PokemonCardAbility.findMany({
                  where: { card: { id: { equals: existingCard.id } } },
                  query: "id name text type",
                }),
                ksContext.db.PokemonCardAttack.findMany({
                  where: { card: { id: { equals: existingCard.id } } },
                  query: "id name text cost damage",
                }),
                ksContext.db.PokemonCardWeakness.findMany({
                  where: { card: { id: { equals: existingCard.id } } },
                  query: "id type value",
                }),
                ksContext.db.PokemonCardResistance.findMany({
                  where: { card: { id: { equals: existingCard.id } } },
                  query: "id type value",
                }),
              ]);

              // 2) Filter out duplicates
              const newAbilitiesData = (card.abilities || []).filter(
                (ability: any) =>
                  !existingAbilities.some(
                    (a: PokemonCardAbility) =>
                      a.name === ability.name &&
                      a.text === ability.text &&
                      a.type === ability.type,
                  ),
              );

              const newAttacksData = (card.attacks || []).filter(
                (attack: any) =>
                  !existingAttacks.some(
                    (a: PokemonCardAttack) =>
                      a.name === attack.name &&
                      a.text === attack.text &&
                      JSON.stringify(a.cost) === JSON.stringify(attack.cost) &&
                      a.damage === (attack.damage ?? null),
                  ),
              );

              const newWeaknessesData = (card.weaknesses || []).filter(
                (weakness: any) =>
                  !existingWeaknesses.some(
                    (w: PokemonCardWeakness) =>
                      w.type === weakness.type && w.value === weakness.value,
                  ),
              );

              const newResistancesData = (card.resistances || []).filter(
                (resistance: any) =>
                  !existingResistances.some(
                    (r: PokemonCardResistance) =>
                      r.type === resistance.type &&
                      r.value === resistance.value,
                  ),
              );

              // 3) Perform the update: only add new children
              //    (Optionally, you can also update fields like HP, rarity, etc.)
              await ksContext.db.PokemonCard.updateOne({
                where: { id: existingCard.id },
                data: {
                  // for example, you could also re-sync HP, images, rarity, etc. here if you want:
                  // hp,
                  // rarity: card.rarity || "",

                  // Create only new children
                  abilities: {
                    create: newAbilitiesData.map((ab: any) => ({
                      name: ab.name,
                      text: ab.text,
                      type: ab.type,
                    })),
                  },
                  attacks: {
                    create: newAttacksData.map((atk: any) => ({
                      name: atk.name,
                      cost: atk.cost || [],
                      convertedEnergyCost: atk.convertedEnergyCost,
                      damage: atk.damage ?? null,
                      text: atk.text ?? null,
                    })),
                  },
                  weaknesses: {
                    create: newWeaknessesData.map((weak: any) => ({
                      type: weak.type,
                      value: weak.value,
                    })),
                  },
                  resistances: {
                    create: newResistancesData.map((res: any) => ({
                      type: res.type,
                      value: res.value,
                    })),
                  },
                },
              });

              serverLog(
                `✅ Updated existing card: ${set.name} - ${card.name} (${variantKey})`,
              );
            }
          } catch (insertError) {
            counters.errorCardIds.push(card.id);
            serverLog(
              "error",
              `❌ Error creating/updating card: ${set.name} - ${card.name} (${variantKey}) (cardId: ${card.id})`,
              insertError,
            );
          }
        }),
      );
    }
  }

  // 4) Wait for all card tasks in this set
  await Promise.all(cardTasks);
  serverLog(
    `🎯 Finished processing set: ${set.name} (TCG Code: ${set.tcgSetId}, Language: ${language})`,
  );
}

/**
 * Main entry function to fetch and store Pokémon cards for each set in DB.
 */
async function fetchAndStorePokemonSetsCards() {
  // Create Keystone context (sudo mode to bypass access checks)
  const ksContext = await getKeystoneContext({ sudo: true });
  // Aggregated counters
  let totalSetsProcessed = 0;
  const counters = {
    totalCardsInserted: 0,
    totalCardsSkipped: 0, // Reusing "skipped" as "updated" to keep minimal changes
    errorCardIds: [] as string[],
  };

  try {
    // 1) Fetch all sets from Keystone
    let sets = await ksContext.db.PokemonSet.findMany({});
    serverLog(`🔍 Found ${sets.length} sets in the database.`);

    // 2) Optional: filter by setId if user requested
    if (specifiedSetId) {
      sets = sets.filter((s: any) => s.tcgSetId === specifiedSetId);
      if (sets.length === 0) {
        serverLog(
          "warn",
          `⚠️ No sets found matching specified setId: ${specifiedSetId}`,
        );
      } else {
        serverLog(`🎯 Processing only specified set: ${specifiedSetId}`);
      }
    }

    // 3) Chunk sets for concurrency
    const setChunks = chunkArray([...sets], SET_CONCURRENCY_LIMIT);

    for (const setChunk of setChunks) {
      // Wait for all sets in this chunk to process in parallel
      await Promise.all(
        setChunk.flatMap((set) =>
          // For each set, also iterate over all supported languages
          POKEMON_SUPPORTED_LANGUAGES.map(async (language) => {
            await processOneSetAndLanguage(
              ksContext,
              set,
              language,
              specifiedCardId,
              counters,
            );
            totalSetsProcessed++;
          }),
        ),
      );
    }

    // Summary logs
    serverLog("\n--- Card Insertion Summary ---");
    serverLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    serverLog(`✅ Total Cards Inserted: ${counters.totalCardsInserted}`);
    serverLog(`⏭️ Total Cards Skipped/Updated: ${counters.totalCardsSkipped}`);

    if (counters.errorCardIds.length > 0) {
      serverLog(
        "warn",
        `❌ The following external card IDs had insert/update errors:\n   ${counters.errorCardIds.join(
          ", ",
        )}`,
      );
    } else {
      serverLog("🎉 All cards created or updated with no fatal errors!");
    }
  } catch (error) {
    serverLog("error", "❌ Error during fetching and storing cards", error);
  } finally {
    // Close out the DB connection if needed
    await ksContext.prisma.$disconnect();
    serverLog("👋 Script to fetch cards has ended...");
  }
}

// Entry point
fetchAndStorePokemonSetsCards().catch((error) => {
  serverLog("error", "❌ Error in fetchAndStorePokemonSetCards script:", error);
  process.exit(1);
});
