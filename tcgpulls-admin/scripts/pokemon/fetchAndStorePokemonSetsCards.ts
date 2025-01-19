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

// Command line arguments
const args = process.argv.slice(2);
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

// Concurrency limits
const SET_CONCURRENCY_LIMIT = 5; // how many sets are processed in parallel
const CARD_CONCURRENCY_LIMIT = 10; // how many card upserts per set in parallel

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
 * then creates or skips the cards in Keystone.
 */
async function processOneSetAndLanguage(
  ksContext: any,
  set: any,
  language: string,
  specifiedCardId: string | null,
  counters: {
    totalCardsInserted: number;
    totalCardsSkipped: number;
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
    // If there's no price data, default to "normal" (like your existing logic)
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
            });

            if (existingCard) {
              // Skip creation, do an update if you want,
              // or truly skip if you do not want to update
              counters.totalCardsSkipped++;
              serverLog(
                `⏭️ Skipping existing card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );
              return;
            }

            // 2) Create new card
            counters.totalCardsInserted++;
            serverLog(
              `✨ Creating new card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
            );

            // Prepare child relationships
            // Keystone 6 allows you to create related items in the same call
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

            // We'll store images in: img/tcg/pokemon/sets/{language}/{tcgSetId}/cards/...
            const baseImagePath = `${POKEMON_R2_STORAGE_PATH}/sets/${set.language}/${set.tcgSetId}/cards`;
            const baseImageName = `${card.id}-${variantKey}`;

            await ksContext.db.PokemonCard.createOne({
              data: {
                name: card.name,
                tcgCardId: card.id,
                tcgSetId: card.set?.id || set.tcgSetId, // fallback
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
                    id: set.id, // 'set.id' is your DB's primary key for PokemonSet
                  },
                },
                // Create the child items in one go
                abilities: {
                  create: abilitiesData,
                },
                attacks: {
                  create: attacksData,
                },
                weaknesses: {
                  create: weaknessesData,
                },
              },
            });

            serverLog(
              `✅ Created new card: ${set.name} - ${card.name} (${variantKey})`,
            );
          } catch (insertError) {
            counters.errorCardIds.push(card.id);
            serverLog(
              "error",
              `❌ Error creating card: ${set.name} - ${card.name} (${variantKey}) (cardId: ${card.id})`,
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
    totalCardsSkipped: 0,
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
    serverLog(`⏭️ Total Cards Skipped: ${counters.totalCardsSkipped}`);

    if (counters.errorCardIds.length > 0) {
      serverLog(
        "warn",
        `❌ The following external card IDs had insert errors:\n   ${counters.errorCardIds.join(", ")}`,
      );
    } else {
      serverLog("🎉 All cards inserted or skipped with no fatal errors!");
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
