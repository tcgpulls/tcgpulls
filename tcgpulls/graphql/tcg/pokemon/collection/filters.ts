import {
  PokemonCollectionItemWhereInput,
  QueryMode,
} from "@/graphql/generated";

/**
 * Creates a GraphQL filter for searching Pokemon collection items
 */
export function buildSearchPokemonCollectionFilter(
  searchQuery: string,
): Partial<PokemonCollectionItemWhereInput> {
  if (!searchQuery) return {};

  return {
    OR: [
      {
        card: { name: { contains: searchQuery, mode: QueryMode.Insensitive } },
      },
      {
        card: {
          number: { contains: searchQuery, mode: QueryMode.Insensitive },
        },
      },
      {
        card: {
          rarity: { contains: searchQuery, mode: QueryMode.Insensitive },
        },
      },
      {
        card: {
          variant: { contains: searchQuery, mode: QueryMode.Insensitive },
        },
      },
      {
        card: {
          set: {
            name: { contains: searchQuery, mode: QueryMode.Insensitive },
          },
        },
      },
      {
        card: {
          set: {
            series: { contains: searchQuery, mode: QueryMode.Insensitive },
          },
        },
      },
    ],
  };
}
