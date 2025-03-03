import { QueryMode, PokemonSetWhereInput } from "@/graphql/generated";

/**
 * Creates a GraphQL filter for searching Pokemon sets
 */
export function buildSearchPokemonSetFilter(
  searchQuery: string,
): Partial<PokemonSetWhereInput> {
  if (!searchQuery) return {};

  return {
    OR: [
      { name: { contains: searchQuery, mode: QueryMode.Insensitive } },
      { series: { contains: searchQuery, mode: QueryMode.Insensitive } },
      { ptcgoCode: { contains: searchQuery, mode: QueryMode.Insensitive } },
    ],
  };
}
