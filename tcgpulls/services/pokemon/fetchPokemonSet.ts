import { prisma } from "@tcg/prisma";
import serverLog from "@/utils/serverLog";

interface FetchPokemonSetArgs {
  setId: string;
  language: string; // Required
}

/**
 * fetchPokemonSet - Retrieves one PokemonSet by (setId, language).
 */
export async function fetchPokemonSet({
  setId,
  language,
}: FetchPokemonSetArgs) {
  try {
    const set = await prisma.pokemonSet.findFirst({
      where: {
        setId: setId,
        language: language,
      },
    });

    if (!set) {
      serverLog(
        "info",
        `fetchPokemonSet: No set found for setId=${setId}, language=${language}`,
      );
      return null;
    }

    serverLog("debug", "fetchPokemonSet: Found set:", set.setId);
    return set;
  } catch (error: unknown) {
    let errorMessage = "Prisma query failed (unknown error)";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    serverLog("error", "fetchPokemonSet: Prisma query failed:", errorMessage);
    throw new Error("Failed to fetch single Pokémon set from the database.");
  }
}
