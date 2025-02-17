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
import CollectionCard from "@/components/tcg/pokemon/collection/CollectionCard";
import { useTranslations } from "use-intl";
import { Button } from "@/components/catalyst-ui/button";
import EmptyList from "@/components/misc/EmptyList";
// Define default orders for each sort key.
const defaultSortOrders: Record<string, OrderDirection> = {
  acquiredAt: OrderDirection.Desc, // Most recent items first
  cardName: OrderDirection.Asc, // Alphabetical order A-Z
  // Add additional keys and their default orders here.
};

interface CollectionListProps {
  userId: string;
  setId?: string;
  tcgBrand: string;
  tcgLang: string;
  sortBy: string;
  sortOrder: OrderDirection;
  initialItems: PokemonCollectionItem[];
}

export default function CollectionList({
  userId,
  setId,
  tcgLang,
  tcgBrand,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
  initialItems,
}: CollectionListProps) {
  // 1) Local state for user-driven sorting
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // When sortBy changes, update the sortOrder based on our mapping.
  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(defaultSortOrders[newSortBy] || OrderDirection.Asc);
  };

  const orderBy = buildCollectionsOrderBy(sortBy, sortOrder);
  const t = useTranslations();

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

  // 4) Fallback to the SSR items if the new query is empty initially
  const items = data?.pokemonCollectionItems?.length
    ? data.pokemonCollectionItems
    : initialItems;

  // 5) The infinite scroll fetchMore function
  const fetchMoreItems = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: {
        skip: offset,
      },
    });
    return moreData?.pokemonCollectionItems ?? [];
  };

  return (
    <div className="pt-2">
      {/* 7) Render the FilterBar with the custom sort key change handler */}
      <FilterBar
        title={`${t("common.collection")}`}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_COLLECTION_SORT_OPTIONS}
      />

      {loading ? (
        <div className="w-full flex items-center justify-center py-36">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyList text={t("collection-page.no-items")}>
          <Button href={`/app/tcg/${tcgBrand}/${tcgLang}`}>
            {t("common.view")} {t("common.pokemon")} {t("common.collectibles")}
          </Button>
        </EmptyList>
      ) : (
        <CardsGrid className="items-stretch">
          <InfiniteList<PokemonCollectionItem>
            key={resetKey} // Force re-mount on each sort change
            initialItems={items}
            fetchMore={fetchMoreItems}
            pageSize={POKEMON_CARDS_PAGE_SIZE}
            renderItem={(item) => {
              if (!item || !item.card) return null;
              const { card } = item;
              return (
                <CollectionCard
                  key={item.id}
                  item={item}
                  href={`/app/tcg/pokemon/${tcgLang}/sets/${card.tcgSetId}/cards/${card.tcgCardId}-${card.variant}-${tcgLang}`}
                />
              );
            }}
          />
        </CardsGrid>
      )}
    </div>
  );
}
