import TCGdex from "@tcgdex/sdk";
import { TCGDexSupportedLanguages } from "@/types/TCGDex";
import axios from "axios";

// Cache for TCGdex instances by language
const instances: Partial<Record<TCGDexSupportedLanguages, TCGdex>> = {};

/**
 * Get or create a TCGdex instance for a specific language.
 * @param language - The language to configure the TCGdex instance (e.g., 'en', 'ja').
 * @returns The TCGdex instance for the given language.
 */
export function getTCGdexInstance(
  language: TCGDexSupportedLanguages = "en",
): TCGdex {
  if (!instances[language]) {
    console.log(`Creating a new TCGdex instance for language: ${language}`);
    instances[language] = new TCGdex(language as any);
  }
  return instances[language]!;
}

/**
 * Clear the cache for a specific language or all languages.
 * @param language - The language to clear. If omitted, clears all instances.
 */
export function clearTCGdexInstance(language?: TCGDexSupportedLanguages): void {
  if (language) {
    console.log(`Clearing TCGdex instance for language: ${language}`);
    delete instances[language];
  } else {
    console.log("Clearing all TCGdex instances");
    Object.keys(instances).forEach(
      (key) => delete instances[key as TCGDexSupportedLanguages],
    );
  }
}

/**
 * Fetch Pokémon sets using the TCGdex instance.
 * @param language - The language to fetch sets for.
 * @param retries - The number of retries to attempt if the fetch fails.
 * @returns An array of Pokémon sets.
 */
export async function fetchPokemonSets(
  language: string,
  retries: number = 3,
): Promise<any> {
  const baseUrl = `https://api.tcgdex.net/v2/${language}/sets`;
  const timeout = 30000; // Increase timeout to 30 seconds (30000ms)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `Fetching sets for language: ${language} (Attempt ${attempt}/${retries})`,
      );

      const response = await axios.get(baseUrl, {
        timeout, // Set the timeout for the request
      });

      return response.data;
    } catch (error) {
      if (attempt === retries) {
        console.error(
          `Failed to fetch Pokémon sets for language: ${language} after ${retries} attempts`,
          error,
        );
        throw new Error(
          `Could not fetch Pokémon sets for language: ${language}`,
        );
      }

      console.warn(
        `Retrying fetch for language: ${language} (Attempt ${attempt + 1}/${retries})`,
      );
    }
  }
}
