"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import CardsGrid from "@/components/tcg/pokemon/cards-page/CardsGrid";
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
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { buildSearchPokemonCollectionFilter } from "@/graphql/tcg/pokemon/collection/filters";

const defaultSortOrders: Record<string, OrderDirection> = {
  acquiredAt: OrderDirection.Desc, // Most recent items first
  cardName: OrderDirection.Asc, // Alphabetical order A-Z
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [manuallyRefetching, setManuallyRefetching] = useState(false);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);

  // 1) Local state for user-driven sorting
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // Memoize the base where filter to prevent unnecessary re-renders
  const baseWhereFilter = useMemo(
    () => ({
      user: { id: { equals: userId } },
      card: {
        set: {
          tcgSetId: { equals: setId },
          language: { equals: tcgLang },
        },
      },
    }),
    [userId, setId, tcgLang],
  );

  // Memoize orderBy to prevent unnecessary re-renders
  const orderBy = useMemo(
    () => buildCollectionsOrderBy(sortBy, sortOrder),
    [sortBy, sortOrder],
  );

  const t = useTranslations();

  // 2) Force re-mount of <InfiniteList> to reset pagination on sort changes
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // Initial query with no search filter
  const { data, loading, fetchMore, refetch } =
    useGetUserPokemonCollectionItemsQuery({
      variables: {
        where: baseWhereFilter,
        orderBy,
        skip: 0,
        take: POKEMON_COLLECTION_PAGE_SIZE,
      },
      // Prevent multiple unnecessary network calls
      fetchPolicy: "cache-and-network",
    });

  // Memoize items selection to prevent unnecessary re-renders
  const items = useMemo(
    () =>
      hasActiveSearch
        ? data?.pokemonCollectionItems || []
        : data?.pokemonCollectionItems?.length
          ? data.pokemonCollectionItems
          : initialItems,
    [hasActiveSearch, data?.pokemonCollectionItems, initialItems],
  );

  // Memoized search handler to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setHasActiveSearch(!!query);

      // If manually clearing the search, refetch immediately
      if (searchQuery && !query) {
        setManuallyRefetching(true);

        // Explicitly refetch with empty filter when clearing
        refetch({
          where: baseWhereFilter,
          orderBy,
          skip: 0,
          take: POKEMON_COLLECTION_PAGE_SIZE,
        }).finally(() => {
          setManuallyRefetching(false);
        });
      }
    },
    [searchQuery, baseWhereFilter, orderBy, refetch],
  );

  // Memoized fetchMore handler
  const fetchMoreItems = useCallback(
    async (offset: number) => {
      const { data: moreData } = await fetchMore({
        variables: {
          skip: offset,
        },
      });
      return moreData?.pokemonCollectionItems ?? [];
    },
    [fetchMore],
  );

  // When sortBy changes, update the sortOrder based on our mapping.
  const handleSortByChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(defaultSortOrders[newSortBy] || OrderDirection.Asc);
  }, []);

  // Memoized search effect to prevent unnecessary triggers
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery === searchQuery) {
      setManuallyRefetching(true);

      const searchFilter =
        buildSearchPokemonCollectionFilter(debouncedSearchQuery);

      refetch({
        where: {
          ...baseWhereFilter,
          ...searchFilter,
        },
        orderBy,
        skip: 0,
        take: POKEMON_COLLECTION_PAGE_SIZE,
      }).finally(() => {
        setManuallyRefetching(false);
      });
    }
  }, [debouncedSearchQuery, searchQuery, baseWhereFilter, orderBy, refetch]);

  // Calculate if we should show loading state
  const isLoading = loading || manuallyRefetching;

  return (
    <div className="pt-2">
      {/* Render the FilterBar with the custom sort key change handler */}
      <FilterBar
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_COLLECTION_SORT_OPTIONS}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      {isLoading ? (
        <div className="w-full flex items-center justify-center py-36">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <div className="w-full flex items-center justify-center py-36 flex-col gap-4">
          <p className="text-gray-500">
            {hasActiveSearch
              ? t("collection-page.no-search-results")
              : t("collection-page.no-items")}
          </p>
          {!hasActiveSearch && (
            <Button
              onClick={() => router.push(`/app/tcg/${tcgBrand}/${tcgLang}`)}
            >
              {t("common.view")} {t("common.pokemon")}{" "}
              {t("common.collectibles")}
            </Button>
          )}
        </div>
      ) : (
        <CardsGrid>
          <InfiniteList<PokemonCollectionItem>
            key={resetKey}
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
