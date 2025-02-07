import {
  OrderDirection,
  PokemonCollectionItemOrderByInput,
} from "@/graphql/generated";
import { POKEMON_COLLECTION_SORT_OPTIONS } from "@/constants/tcg/pokemon";
import { TcgCollectionSortByT } from "@/types/Tcg";

export default function buildCollectionsOrderBy(
  sortBy: string,
  sortOrder: OrderDirection,
): PokemonCollectionItemOrderByInput[] {
  if (!POKEMON_COLLECTION_SORT_OPTIONS.includes(<TcgCollectionSortByT>sortBy)) {
    console.warn(`Unsupported sort field: ${sortBy}`);
    sortBy = POKEMON_COLLECTION_SORT_OPTIONS[0];
  }

  if (sortBy.startsWith("card.")) {
    // e.g. "card.name" => subField = "name"
    const subField = sortBy.slice("card.".length);
    return [
      {
        card: {
          [subField]: sortOrder,
        },
      } as unknown as PokemonCollectionItemOrderByInput,
    ];
  }

  // top-level field
  return [
    {
      [sortBy]: sortOrder,
    } as unknown as PokemonCollectionItemOrderByInput,
  ];
}
