import { fetchPokemonTcgApiSets } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSets";
import { prisma } from "@/lib/prisma";
import { PokemonTCGSetT } from "@/types/PokemonTCG";
import customLog from "@/utils/customLog";
import pLimit from "p-limit";

const languages = ["en"];
const args = process.argv.slice(2);
const force = args.includes("--force");
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;

const setMainSetSubsetRelationships: { [key: string]: string } = {
  swsh45: "swsh45sv",
  cel25: "cel25c",
  swsh9: "swsh9tg",
  swsh10: "swsh10tg",
  swsh11: "swsh11tg",
  swsh12: "swsh12tg",
  swsh12pt5: "swsh12pt5gg",
};

const isBoosterPackUtility = (set: PokemonTCGSetT) => {
  if (Object.values(setMainSetSubsetRelationships).includes(set.id)) {
    return false;
  }
  if (!set.ptcgoCode) return false;
  return !["PR", "FUT", "BP", "SVE"].some((prefix) =>
    set.ptcgoCode.startsWith(prefix),
  );
};

// Adjust concurrency limit as needed
const CONCURRENCY_LIMIT = 10;
const limit = pLimit(CONCURRENCY_LIMIT);

async function fetchAndStorePokemonSets() {
  let totalSetsProcessed = 0;
  let totalSetsSkipped = 0;
  let totalSetsFailed = 0;

  try {
    for (const language of languages) {
      customLog(`\n🔍 Fetching sets for language: ${language}...`);
      const sets = await fetchPokemonTcgApiSets(language);

      if (!sets || sets.length === 0) {
        customLog("warn", `⚠️ No sets found for language: ${language}`);
        continue;
      }

      customLog(`✅ Fetched ${sets.length} sets for language: ${language}`);

      const uniqueSets = new Map<string, PokemonTCGSetT>();
      sets.forEach((set) => {
        const uniqueId = `${language}-${set.id}`;
        if (!uniqueSets.has(uniqueId)) {
          uniqueSets.set(uniqueId, set);
        } else {
          customLog(
            "warn",
            `⚠️ Duplicate set detected: ${set.id} in language: ${language}`,
          );
        }
      });

      // Filter sets if a specific setId is provided
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

      const createOrUpdateSet = async (
        set: PokemonTCGSetT,
        parentSetOriginalId: string | null = null,
      ) => {
        const isBoosterPack = isBoosterPackUtility(set);

        // Check if set exists unless forcing
        const exists = await prisma.pokemonSet.findUnique({
          where: {
            originalId_language: {
              originalId: set.id,
              language: language,
            },
          },
        });

        if (exists && !force) {
          customLog(`⏭️ Skipping existing set: ${set.id} (${set.name})`);
          totalSetsSkipped++;
          return;
        }

        try {
          await prisma.pokemonSet.upsert({
            where: {
              originalId_language: {
                originalId: set.id,
                language: language,
              },
            },
            update: {
              name: set.name,
              series: set.series,
              logo: set.images.logo ?? "",
              symbol: set.images.symbol ?? "",
              printedTotal: set.printedTotal || 0,
              total: set.total || 0,
              ptcgoCode: set.ptcgoCode || null,
              releaseDate: set.releaseDate
                ? new Date(set.releaseDate)
                : new Date(),
              updatedAt: set.updatedAt ? new Date(set.updatedAt) : new Date(),
              parentSet: parentSetOriginalId
                ? {
                    connect: {
                      originalId_language: {
                        originalId: parentSetOriginalId,
                        language: language,
                      },
                    },
                  }
                : undefined,
              isBoosterPack,
            },
            create: {
              originalId: set.id,
              language,
              name: set.name,
              series: set.series,
              logo: set.images.logo ?? "",
              symbol: set.images.symbol ?? "",
              printedTotal: set.printedTotal || 0,
              total: set.total || 0,
              ptcgoCode: set.ptcgoCode || null,
              releaseDate: set.releaseDate
                ? new Date(set.releaseDate)
                : new Date(),
              updatedAt: set.updatedAt ? new Date(set.updatedAt) : new Date(),
              parentSet: parentSetOriginalId
                ? {
                    connect: {
                      originalId_language: {
                        originalId: parentSetOriginalId,
                        language: language,
                      },
                    },
                  }
                : undefined,
              isBoosterPack,
            },
          });

          customLog(`✅ Stored/Updated set: ${set.id} (${set.name})`);
          totalSetsProcessed++;
        } catch (err) {
          totalSetsFailed++;
          customLog(
            "error",
            `❌ Failed to process set: ${set.id} (${set.name})`,
            err,
          );
        }
      };

      // Create tasks for all sets in this language batch
      const tasks = filteredSets.map((set) =>
        limit(() => createOrUpdateSet(set)),
      );

      // Wait for all tasks (sets) to complete
      await Promise.all(tasks);

      customLog(`🎉 Successfully processed sets for language: ${language}`);
    }

    // Final Summary
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

fetchAndStorePokemonSets().catch((error) => {
  customLog("error", "❌ Error in fetchAndStorePokemonSets script:", error);
  process.exit(1);
});
