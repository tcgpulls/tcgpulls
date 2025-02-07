"use client";

import { useState, useEffect } from "react";
import CardsGrid from "@/components/misc/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import Spinner from "@/components/misc/Spinner";

import {
  OrderDirection,
  PokemonCollectionItem,
  useGetUserPokemonCollectionItemsQuery,
} from "@/graphql/generated";
import {
  POKEMON_CARDS_PAGE_SIZE,
  POKEMON_COLLECTION_PAGE_SIZE,
  POKEMON_COLLECTION_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";
import { FilterBar } from "@/components/navigation/FilterBar";
import buildCollectionsOrderBy from "@/utils/buildCollectionsOrderBy";
import CollectionCard from "@/components/tcg/CollectionCard";

interface CollectionListProps {
  /** The user ID for the query */
  userId: string;
  /** If we only want to show items from a specific set, pass setId */
  setId?: string;
  /** The TCG language (e.g. 'en') */
  tcgLang: string;
  /** The default sort field passed from SSR (e.g., 'acquiredAt') */
  sortBy: string;
  /** The default sort order (e.g., OrderDirection.Desc) */
  sortOrder: OrderDirection;
  /** The initial SSR-fetched items */
  initialItems: PokemonCollectionItem[];
}

// Add more if your schema supports them (like "grade", "card.name", etc.)

export default function CollectionList({
  userId,
  setId,
  tcgLang,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
  initialItems,
}: CollectionListProps) {
  // 1) Local state for user-driven sorting
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);
  const orderBy = buildCollectionsOrderBy(sortBy, sortOrder);

  // 2) Force re-mount of <InfiniteList> to reset pagination on sort changes
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // 3) The query to fetch more items on the client
  const { data, loading, fetchMore } = useGetUserPokemonCollectionItemsQuery({
    variables: {
      where: {
        user: { id: { equals: userId } },
        card: {
          set: {
            tcgSetId: { equals: setId },
            language: { equals: tcgLang },
          },
        },
      },
      orderBy,
      skip: 0,
      take: POKEMON_COLLECTION_PAGE_SIZE,
    },
  });

  // 4) We fallback to the SSR items if the new query is empty initially
  const items = data?.pokemonCollectionItems?.length
    ? data.pokemonCollectionItems
    : initialItems;

  // 5) The infinite scroll fetchMore
  const fetchMoreItems = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: {
        skip: offset,
      },
    });
    return moreData?.pokemonCollectionItems ?? [];
  };

  // 6) Optional loading state if data = undefined
  if (loading && !data) {
    return (
      <div className="py-36 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/*
        7) A FilterBar:
          - The user can pick a sort field from COLLECTION_SORT_OPTIONS
          - Switch between Asc / Desc
      */}
      <FilterBar
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_COLLECTION_SORT_OPTIONS}
      />

      <CardsGrid>
        <InfiniteList<PokemonCollectionItem>
          key={resetKey} // force re-mount on each sort change
          initialItems={items}
          fetchMore={fetchMoreItems}
          pageSize={POKEMON_CARDS_PAGE_SIZE}
          renderItem={(item) => {
            const card = item.card;
            if (!card) return null;
            return (
              <CollectionCard
                key={card.id}
                card={card}
                href={`/app/tcg/pokemon/${tcgLang}/sets/${card.tcgSetId}/cards/${card.tcgCardId}-${card.variant}-${tcgLang}`}
              />
            );
          }}
        />
      </CardsGrid>
    </div>
  );
}
