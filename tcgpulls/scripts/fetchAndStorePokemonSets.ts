import { fetchPokemonSets } from "@/lib/pokemontcg";
import { prisma } from "@/lib/prisma";
import path from "path";
import { downloadImage } from "@/utils/downloadImage";
import { ensureDirectoryExists } from "@/utils/ensureDirectoryExists";
import { PokemonSet } from "@prisma/client";
import { PokemonTCGSetT } from "@/types/PokemonTCG";
import { fileExists } from "@/utils/fileExists";

const languages = ["en"];

// Directories to store images
const logoDir = path.join(process.cwd(), "public/img/sets/logo");
const symbolDir = path.join(process.cwd(), "public/img/sets/symbol");

// Filter out sets that aren't booster packs like promos, etc.
const setFilteringUtility = (set: PokemonSet) => {
  if (!set.ptcgoCode) return false;
  return !["PR", "FUT", "BP", "SVE"].some((prefix) =>
    set.ptcgoCode?.startsWith(prefix),
  );
};

// Define main set-subset relationships
const setMainSetSubsetRelationships: { [key: string]: string } = {
  swsh45: "swsh45sv", // Shining Fates -> Shining Fates Shiny Vault
  cel25: "cel25c", // Celebrations -> Celebrations Classic Collection
  swsh9: "swsh9tg", // Brilliant Stars -> Brilliant Stars Trainer Gallery
  swsh10: "swsh10tg", // Astral Radiance -> Astral Radiance Trainer Gallery
  swsh11: "swsh11tg", // Lost Origin -> Lost Origin Trainer Gallery
  swsh12: "swsh12tg", // Silver Tempest -> Silver Tempest Trainer Gallery
  swsh12pt5: "swsh12pt5gg", // Crown Zenith -> Crown Zenith Galarian Gallery
};

export async function fetchAndStorePokemonSets(forceImageDownload = false) {
  try {
    ensureDirectoryExists(logoDir);
    ensureDirectoryExists(symbolDir);

    for (const language of languages) {
      console.log(`Fetching sets for language: ${language}...`);
      const sets = await fetchPokemonSets(language);

      if (!sets || sets.length === 0) {
        console.warn(`No sets found for language: ${language}`);
        continue;
      }

      console.log(`Fetched ${sets.length} sets for language: ${language}`);

      const filteredSets = sets.filter(setFilteringUtility);

      // Deduplicate sets
      const uniqueSets = new Map();
      filteredSets.forEach((set) => {
        const uniqueId = `${language}-${set.id}`;
        if (!uniqueSets.has(uniqueId)) {
          uniqueSets.set(uniqueId, set);
        } else {
          console.warn(
            `Duplicate set detected: ${set.id} in language: ${language}`,
          );
        }
      });

      // Separate parent sets and subsets
      const parentSets: PokemonTCGSetT[] = [];
      const subsets: PokemonTCGSetT[] = [];

      uniqueSets.forEach((set) => {
        if (setMainSetSubsetRelationships[set.id]) {
          parentSets.push(set);
        } else if (
          Object.values(setMainSetSubsetRelationships).includes(set.id)
        ) {
          subsets.push(set);
        } else {
          parentSets.push(set); // Treat sets without explicit relationships as parent sets
        }
      });

      // Function to create a set in the database
      const createSet = async (
        set: PokemonTCGSetT,
        parentSetOriginalId: string | null = null,
      ) => {
        const logoFilename = `logo-${set.id}-${language}.png`;
        const symbolFilename = `symbol-${set.id}-${language}.png`;

        // Upsert the set in the database
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
            logo: set.images.logo ? `/img/sets/logo/${logoFilename}` : "",
            symbol: set.images.symbol
              ? `/img/sets/symbol/${symbolFilename}`
              : "",
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
          },
          create: {
            originalId: set.id,
            language,
            name: set.name,
            series: set.series,
            logo: set.images.logo ? `/img/sets/logo/${logoFilename}` : "",
            symbol: set.images.symbol
              ? `/img/sets/symbol/${symbolFilename}`
              : "",
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
          },
        });

        // Download and save logo image
        if (set.images.logo) {
          const logoPath = path.join(logoDir, logoFilename);
          if (forceImageDownload || !fileExists(logoPath)) {
            await downloadImage(set.images.logo, logoPath);
            console.log(`Downloaded logo for set: ${set.name} - ${set.id}...`);
          } else {
            console.log(`Logo already exists for set: ${set.name} - ${set.id}`);
          }
        } else {
          console.log(`No logo found for set: ${set.name} - ${set.id}`);
        }

        // Download and save symbol image
        if (set.images.symbol) {
          const symbolPath = path.join(symbolDir, symbolFilename);
          if (forceImageDownload || !fileExists(symbolPath)) {
            await downloadImage(set.images.symbol, symbolPath);
            console.log(
              `Downloaded symbol for set: ${set.name} - ${set.id}...`,
            );
          } else {
            console.log(
              `Symbol already exists for set: ${set.name} - ${set.id}`,
            );
          }
        } else {
          console.log(`No symbol found for set: ${set.name} - ${set.id}`);
        }
      };

      // Create parent sets first
      for (const parentSet of parentSets) {
        await createSet(parentSet);
      }

      // Create subsets after their parent sets have been created
      for (const subset of subsets) {
        const parentSetOriginalId = Object.keys(
          setMainSetSubsetRelationships,
        ).find((key) => setMainSetSubsetRelationships[key] === subset.id);

        if (!parentSetOriginalId) {
          console.warn(
            `Parent set originalId not found for subset: ${subset.id} in language: ${language}`,
          );
          continue;
        }

        // Check if the parent set exists
        const parentSet = await prisma.pokemonSet.findUnique({
          where: {
            originalId_language: {
              originalId: parentSetOriginalId,
              language: language,
            },
          },
        });

        if (!parentSet) {
          console.warn(
            `Parent set not found for subset: ${subset.id} in language: ${language}`,
          );
          continue;
        }

        // Create the subset and associate with the parent set
        await createSet(subset, parentSetOriginalId || null); // Ensure correct type is passed
      }

      console.log(`Successfully stored sets for language: ${language}`);
    }
  } catch (error) {
    console.error(
      "Error wiping the Pokémon sets table or fetching data:",
      error,
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const args = process.argv.slice(2);
const forceImageDownload = args.includes("--forceImageDownload");

fetchAndStorePokemonSets(forceImageDownload).catch((error) => {
  console.error("Error in fetchAndStorePokemonSets script:", error);
  process.exit(1);
});
