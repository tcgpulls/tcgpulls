import { prisma } from "@tcg/prisma";
import customLog from "@/utils/customLog";
import { POKEMON_SETS_SORT_OPTIONS } from "@/constants/tcg/pokemon";
import { TcgSortOrderT } from "@/types/Tcg";

interface FetchPokemonSetsArgs {
  language: string;
  sortBy: string;
  sortOrder: TcgSortOrderT;
  limit?: number;
  offset?: number;
  isBoosterPack?: boolean | null;
}

export async function fetchPokemonSets({
  language,
  sortBy,
  sortOrder,
  limit = 50,
  offset = 0,
  isBoosterPack = null,
}: FetchPokemonSetsArgs) {
  // Construct the where clause
  const whereClause: Record<string, unknown> = { language };
  if (isBoosterPack !== null) {
    whereClause.isBoosterPack = isBoosterPack;
  }

  customLog(
    "debug",
    "fetchPokemonSets: Prisma Query Where Clause:",
    whereClause,
  );

  try {
    // Validate the sortBy key to ensure it's a valid field in the schema
    if (!POKEMON_SETS_SORT_OPTIONS.includes(sortBy)) {
      throw new Error(`Invalid sortBy field: ${sortBy}`);
    }

    // Count the total matching sets
    const total = await prisma.pokemonSet.count({ where: whereClause });
    customLog("debug", `fetchPokemonSets: Total matching sets = ${total}`);

    // If none found, return early
    if (total === 0) {
      customLog(
        "info",
        `fetchPokemonSets: No sets found for language=${language}, isBoosterPack=${isBoosterPack}`,
      );
      return { sets: [], total: 0 };
    }

    // Fetch the sets with pagination and dynamic sorting
    const sets = await prisma.pokemonSet.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder }, // Dynamic sorting
      take: limit,
      skip: offset,
    });

    customLog("debug", `fetchPokemonSets: Fetched ${sets.length} sets from DB`);

    return { sets, total };
  } catch (error: unknown) {
    let errorMessage = "Prisma query failed (unknown error)";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    customLog("error", "fetchPokemonSets: Prisma query failed:", errorMessage);
    throw new Error("Failed to fetch Pokémon sets from the database.");
  }
}
