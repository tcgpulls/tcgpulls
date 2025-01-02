import { prisma } from "@tcg/prisma";
import customLog from "@/utils/customLog";
import { POKEMON_CARDS_SORT_OPTIONS } from "@/constants/tcg/pokemon";
import { TcgSortOrderT } from "@/types/Tcg";

interface FetchPokemonCardsArgs {
  tcgLang: string;
  sortBy: string;
  sortOrder: TcgSortOrderT;
  limit?: number;
  offset?: number;
  setIds?: string[];
}

export async function fetchPokemonCards({
  tcgLang,
  sortBy,
  sortOrder,
  limit = 50,
  offset = 0,
  setIds = [],
}: FetchPokemonCardsArgs) {
  // Construct the where clause
  const whereClause: Record<string, unknown> = { language: tcgLang };

  // If front-end passes TCG set codes (like "swsh1"), match PokemonSet.setId.
  if (setIds.length > 0) {
    whereClause.set = { setId: { in: setIds } };
  }

  customLog("debug", "Prisma Query Where Clause:", whereClause);

  try {
    // Validate the sortBy key to ensure it's a valid field in the schema
    if (!POKEMON_CARDS_SORT_OPTIONS.includes(sortBy)) {
      throw new Error(`Invalid sortBy field: ${sortBy}`);
    }

    const total = await prisma.pokemonCard.count({ where: whereClause });
    customLog("debug", `fetchPokemonCards: Total matching cards = ${total}`);

    if (total === 0) {
      customLog(
        "info",
        `fetchPokemonCards: No cards found for language=${tcgLang}, setIds=[${setIds.join(", ")}]`,
      );
      return { cards: [], total: 0 };
    }

    const cards = await prisma.pokemonCard.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
    });

    customLog(
      "debug",
      `fetchPokemonCards: Fetched ${cards.length} cards from DB`,
    );

    return { cards, total };
  } catch (error: unknown) {
    let errorMessage = "Prisma query failed (unknown error)";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    customLog("error", "fetchPokemonCards: Prisma query failed:", errorMessage);
    throw new Error("Failed to fetch Pokémon cards from the database.");
  }
}
