import axios from "axios";
import { POKEMONTCG_API_BASE_URL } from "./config";
import serverLog from "../../utils/serverLog";

export async function fetchPokemonTcgApiSetCards(
  language: string,
  setId: string,
  retries = 3,
) {
  const baseUrl = `${POKEMONTCG_API_BASE_URL}/cards?q=set.id:${setId}`;
  const timeout = 30000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      serverLog(
        `Fetching card for language: ${language} (Attempt ${attempt}/${retries})`,
      );

      const response = await axios.get(baseUrl, {
        timeout,
        headers: {
          "X-Api-Key": process.env.POKEMONTCG_API_KEY,
        },
      });

      const cards = response.data?.data;

      // Ensure the response contains a single card object
      if (cards) {
        serverLog(`Successfully fetched cards for set: ${setId}.`);
        return cards;
      } else {
        throw new Error(
          "Unexpected API response format: 'data' is not a valid card object.",
        );
      }
    } catch (error) {
      if (attempt === retries) {
        serverLog(
          "error",
          `Failed to fetch Pokémon card for language: ${language} after ${retries} attempts`,
          error,
        );
        throw new Error(
          `Could not fetch Pokémon card for language: ${language}`,
        );
      }

      serverLog(
        "warn",
        `Retrying fetch for language: ${language} (Attempt ${
          attempt + 1
        }/${retries})`,
      );
    }
  }

  throw new Error(`Exhausted retries for language: ${language}`);
}
