import axios from "axios";
import { POKEMONTCG_API_BASE_URL } from "@/lib/PokemonTcgApi/config";
import customLog from "@/utils/customLog";

/**
 * Fetch Pokémon sets using the TCGdex API.
 * @param language - The language to fetch sets for.
 * @param retries - The number of retries to attempt if the fetch fails.
 * @returns An array of Pokémon sets.
 */
export async function fetchPokemonTcgApiSets(
  language: string,
  retries: number = 3,
) {
  const baseUrl = `${POKEMONTCG_API_BASE_URL}/sets`;
  const timeout = 30000; // Increase timeout to 30 seconds (30000ms)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      customLog(
        `Fetching sets for language: ${language} (Attempt ${attempt}/${retries})`,
      );

      const response = await axios.get(baseUrl, {
        timeout, // Set the timeout for the request
        headers: {
          "X-Api-Key": process.env.POKEMONTCG_API_KEY,
        },
      });

      // Ensure we access the correct data
      const sets = response.data?.data;

      if (Array.isArray(sets)) {
        customLog(`Successfully fetched ${sets.length} sets.`);
        return sets;
      } else {
        throw new Error(
          "Unexpected API response format: 'data' is not an array.",
        );
      }
    } catch (error) {
      if (attempt === retries) {
        customLog(
          "error",
          `Failed to fetch Pokémon sets for language: ${language} after ${retries} attempts`,
          error,
        );
        throw new Error(
          `Could not fetch Pokémon sets for language: ${language}`,
        );
      }

      customLog(
        "warn",
        `Retrying fetch for language: ${language} (Attempt ${
          attempt + 1
        }/${retries})`,
      );
    }
  }

  // Fallback in case retries fail
  throw new Error(`Exhausted retries for language: ${language}`);
}
