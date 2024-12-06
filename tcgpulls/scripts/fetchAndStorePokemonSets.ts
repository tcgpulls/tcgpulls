import { fetchPokemonSets } from "@/lib/tcgdex";
import { prisma } from "@/lib/prisma";
import { TCGDexSupportedLanguages } from "@/types/TCGDex";

const languages: TCGDexSupportedLanguages[] = [
  "en",
  "fr",
  "es",
  "it",
  "pt",
  "de",
  "nl",
  "pl",
  "ru",
  "ja",
  "ko",
  "zh-tw",
  "id",
  "th",
  "zh-cn",
];

async function fetchAndStorePokemonSets() {
  try {
    console.log("Wiping existing Pokémon sets from the database...");
    await prisma.pokemonSet.deleteMany({});
    console.log("Existing Pokémon sets wiped successfully.");

    for (const language of languages) {
      try {
        console.log(`Fetching sets for language: ${language}...`);
        const sets = await fetchPokemonSets(language);

        if (!sets || sets.length === 0) {
          console.warn(`No sets found for language: ${language}`);
          continue;
        }

        console.log(`Fetched ${sets.length} sets for language: ${language}`);

        // Deduplicate sets and assign insertion order
        const uniqueSets = new Map();
        sets.forEach((set: any, index: number) => {
          const uniqueId = `${language}-${set.id}`; // Ensure unique ID
          if (!uniqueSets.has(uniqueId)) {
            uniqueSets.set(uniqueId, { ...set, insertionOrder: index + 1 }); // Assign insertion order
          } else {
            console.warn(
              `Duplicate set detected: ${set.id} in language: ${language}`,
            );
          }
        });

        // Insert deduplicated sets into the database
        for (const [uniqueId, set] of uniqueSets.entries()) {
          await prisma.pokemonSet.create({
            data: {
              id: uniqueId,
              name: set.name,
              logo: set.logo || null,
              symbol: set.symbol || null,
              totalCards: set.cardCount.total,
              officialCards: set.cardCount.official,
              language,
              releaseDate: set.releaseDate || null,
              insertionOrder: set.insertionOrder, // Correct insertion order
            },
          });
        }
        console.log(`Successfully stored sets for language: ${language}`);
      } catch (error) {
        console.error(`Failed to store sets for language: ${language}`, error);
      }
    }
  } catch (error) {
    console.error(
      "Error wiping the Pokémon sets table or fetching data:",
      error,
    );
    process.exit(1);
  }
}

fetchAndStorePokemonSets().catch((error) => {
  console.error("Error in fetchAndStorePokemonSets script:", error);
  process.exit(1);
});
