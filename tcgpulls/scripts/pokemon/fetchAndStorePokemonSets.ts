import { fetchPokemonTcgApiSets } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSets";
import { prisma } from "@/lib/prisma";
import customLog from "@/utils/customLog";
import pLimit from "p-limit";
import {
  POKEMON_SETS_WITH_SUBSETS,
  POKEMON_SUPPORTED_LANGUAGES,
} from "@/constants/tcg/pokemon";
import { PokemonTcgApiSetT } from "@/types/Pokemon";

const args = process.argv.slice(2);
const force = args.includes("--force-update");
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;

/**
 * A set is a "subset" if it appears as a **value** in the POKEMON_SETS_WITH_SUBSETS object.
 */
function isSubset(setId: string): boolean {
  return Object.values(POKEMON_SETS_WITH_SUBSETS).includes(setId);
}

/**
 * If 'possibleSubsetId' matches a **value** in `POKEMON_SETS_WITH_SUBSETS`,
 * return the **key** (i.e., the parent's TCG code). Otherwise null.
 */
function findParentSetTCGId(possibleSubsetId: string): string | null {
  for (const [parentSet, subsetSet] of Object.entries(
    POKEMON_SETS_WITH_SUBSETS,
  )) {
    if (subsetSet === possibleSubsetId) {
      return parentSet;
    }
  }
  return null;
}

/**
 * Heuristic to decide if a set is a booster pack or not.
 */
function isBoosterPackUtility(set: PokemonTcgApiSetT) {
  // If this set is recognized as a subset, it's not a booster
  if (isSubset(set.id)) {
    return false;
  }
  if (!set.ptcgoCode) return false;
  return !["PR", "FUT", "BP", "SVE"].some((prefix) =>
    set.ptcgoCode.startsWith(prefix),
  );
}

const CONCURRENCY_LIMIT = 10;
const limit = pLimit(CONCURRENCY_LIMIT);

async function fetchAndStorePokemonSets() {
  let totalSetsProcessed = 0;
  let totalSetsSkipped = 0;
  let totalSetsFailed = 0;

  try {
    for (const language of POKEMON_SUPPORTED_LANGUAGES) {
      customLog(`\n🔍 Fetching sets for language: ${language}...`);
      const sets = await fetchPokemonTcgApiSets(language);

      if (!sets || sets.length === 0) {
        customLog("warn", `⚠️ No sets found for language: ${language}`);
        continue;
      }

      customLog(`✅ Fetched ${sets.length} sets for language: ${language}`);

      // Deduplicate sets by (language + set.id)
      const uniqueSets = new Map<string, PokemonTcgApiSetT>();
      for (const apiSet of sets) {
        const uniqueKey = `${language}-${apiSet.id}`;
        if (!uniqueSets.has(uniqueKey)) {
          uniqueSets.set(uniqueKey, apiSet);
        } else {
          customLog(
            "warn",
            `⚠️ Duplicate set detected: ${apiSet.id} in language: ${language}`,
          );
        }
      }

      // Filter down to a single setId if user specified via CLI
      let filteredSets = [...uniqueSets.values()];
      if (specifiedSetId) {
        filteredSets = filteredSets.filter((s) => s.id === specifiedSetId);
        if (filteredSets.length === 0) {
          customLog(
            "warn",
            `⚠️ No sets found matching specified setId: ${specifiedSetId}`,
          );
        } else {
          customLog(`🎯 Processing only specified set: ${specifiedSetId}`);
        }
      }

      /**
       * --- IMPORTANT ---
       * Sort so that PARENT sets come BEFORE their SUBSETS.
       * This ensures "parentSet" is created first, so the subset can connect without P2025 error.
       *
       * - If 'a' is NOT a subset, but 'b' is a subset => 'a' goes first
       * - If 'a' is a subset, but 'b' is NOT => 'b' goes first
       * - Otherwise, keep them in the same order
       */
      filteredSets.sort((a, b) => {
        const aIsSubset = isSubset(a.id);
        const bIsSubset = isSubset(b.id);
        if (aIsSubset && !bIsSubset) return 1;
        if (!aIsSubset && bIsSubset) return -1;
        return 0;
      });

      // Now process each set
      const tasks = filteredSets.map((apiSet) =>
        limit(async () => {
          const isBoosterPack = isBoosterPackUtility(apiSet);

          // If this set is recognized as a subset, find its parent's TCG code
          const parentSetTCGId = findParentSetTCGId(apiSet.id);

          // See if set already exists in DB
          const existingSet = await prisma.pokemonSet.findUnique({
            where: {
              setId_language: {
                setId: apiSet.id,
                language,
              },
            },
          });

          // If found and not forcing an update, skip
          if (existingSet && !force) {
            customLog(
              `⏭️ Skipping existing set: ${apiSet.id} (${apiSet.name})`,
            );
            totalSetsSkipped++;
            return;
          }

          try {
            // Upsert the set
            await prisma.pokemonSet.upsert({
              where: {
                setId_language: {
                  setId: apiSet.id,
                  language,
                },
              },
              update: {
                name: apiSet.name,
                series: apiSet.series,
                logo: apiSet.images.logo ?? "",
                symbol: apiSet.images.symbol ?? "",
                printedTotal: apiSet.printedTotal || 0,
                total: apiSet.total || 0,
                ptcgoCode: apiSet.ptcgoCode || null,
                releaseDate: apiSet.releaseDate
                  ? new Date(apiSet.releaseDate)
                  : new Date(),
                updatedAt: apiSet.updatedAt
                  ? new Date(apiSet.updatedAt)
                  : new Date(),
                // Connect to the parent if we have one
                parentSet: parentSetTCGId
                  ? {
                      connect: {
                        setId_language: {
                          setId: parentSetTCGId,
                          language,
                        },
                      },
                    }
                  : undefined,
                isBoosterPack,
              },
              create: {
                setId: apiSet.id,
                language,
                name: apiSet.name,
                series: apiSet.series,
                logo: apiSet.images.logo ?? "",
                symbol: apiSet.images.symbol ?? "",
                printedTotal: apiSet.printedTotal || 0,
                total: apiSet.total || 0,
                ptcgoCode: apiSet.ptcgoCode || null,
                releaseDate: apiSet.releaseDate
                  ? new Date(apiSet.releaseDate)
                  : new Date(),
                updatedAt: apiSet.updatedAt
                  ? new Date(apiSet.updatedAt)
                  : new Date(),
                parentSet: parentSetTCGId
                  ? {
                      connect: {
                        setId_language: {
                          setId: parentSetTCGId,
                          language,
                        },
                      },
                    }
                  : undefined,
                isBoosterPack,
              },
            });

            customLog(`✅ Stored/Updated set: ${apiSet.id} (${apiSet.name})`);
            totalSetsProcessed++;
          } catch (err) {
            totalSetsFailed++;
            customLog(
              "error",
              `❌ Failed to process set: ${apiSet.id} (${apiSet.name})`,
              err,
            );
          }
        }),
      );

      // Wait for the concurrency-limited tasks to finish
      await Promise.all(tasks);

      customLog(`🎉 Successfully processed sets for language: ${language}`);
    }

    // Summary log
    customLog("\n--- Pokémon Set Processing Summary ---");
    customLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    customLog(`⏭️ Total Sets Skipped: ${totalSetsSkipped}`);
    customLog(`❌ Total Sets Failed: ${totalSetsFailed}`);

    if (totalSetsFailed === 0) {
      customLog("🎉 All sets processed successfully with no errors!");
    } else {
      customLog(
        "warn",
        "⚠️ Some sets failed to process. Check logs for details.",
      );
    }
  } catch (error) {
    customLog("error", "❌ Error fetching and storing Pokémon sets:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Main
fetchAndStorePokemonSets().catch((error) => {
  customLog("error", "❌ Error in fetchAndStorePokemonSets script:", error);
  process.exit(1);
});
