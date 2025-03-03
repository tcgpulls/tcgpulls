import { QueryMode, PokemonCardWhereInput } from "@/graphql/generated";

/**
 * Creates a GraphQL filter for searching Pokemon cards directly
 */
export function buildSearchPokemonCardFilter(
  searchQuery: string,
): Partial<PokemonCardWhereInput> {
  if (!searchQuery) return {};

  return {
    OR: [
      { name: { contains: searchQuery, mode: QueryMode.Insensitive } },
      { number: { contains: searchQuery, mode: QueryMode.Insensitive } },
      { rarity: { contains: searchQuery, mode: QueryMode.Insensitive } },
      { variant: { contains: searchQuery, mode: QueryMode.Insensitive } },
      {
        set: {
          name: { contains: searchQuery, mode: QueryMode.Insensitive },
        },
      },
      {
        set: {
          series: { contains: searchQuery, mode: QueryMode.Insensitive },
        },
      },
    ],
  };
}
