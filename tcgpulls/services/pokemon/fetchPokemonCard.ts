import { prisma } from "@tcg/prisma";
import serverLog from "@/utils/serverLog";

interface FetchPokemonCardArgs {
  cardId: string;
  language: string; // Required now
}

/**
 * fetchPokemonCard - Retrieves one PokemonCard by (cardId, language).
 */
export async function fetchPokemonCard({
  cardId,
  language,
}: FetchPokemonCardArgs) {
  try {
    const card = await prisma.pokemonCard.findFirst({
      where: {
        cardId: cardId,
        language: language,
      },
    });

    if (!card) {
      serverLog(
        "info",
        `fetchPokemonCard: No card found for cardId=${cardId}, language=${language}`,
      );
      return null;
    }

    serverLog("debug", "fetchPokemonCard: Found card:", card.cardId);
    return card;
  } catch (error: unknown) {
    let errorMessage = "Prisma query failed (unknown error)";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    serverLog("error", "fetchPokemonCard: Prisma query failed:", errorMessage);
    throw new Error("Failed to fetch single Pokémon card from the database.");
  }
}
