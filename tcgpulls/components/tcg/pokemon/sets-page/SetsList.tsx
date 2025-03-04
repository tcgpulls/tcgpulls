"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import InfiniteList from "@/components/misc/InfiniteList";
import SetCard from "@/components/tcg/pokemon/sets-page/SetCard";
import SetsGrid from "@/components/tcg/pokemon/sets-page/SetsGrid";

import {
  useGetPokemonSetsQuery,
  OrderDirection,
  PokemonSetItemFragment,
} from "@/graphql/generated";
import { TcgBrandT, TcgCategoryT, TcgLangT, TcgSetSortByT } from "@/types/Tcg";
import {
  POKEMON_SETS_PAGE_SIZE,
  POKEMON_SETS_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";
import { FilterBar } from "@/components/navigation/FilterBar";
import Spinner from "@/components/misc/Spinner";
import SetsHeader from "@/components/tcg/pokemon/sets-page/SetsHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { buildSearchPokemonSetFilter } from "@/graphql/tcg/pokemon/sets/filters";
import { useTranslations } from "use-intl";

// 1. Define a mapping for default sort orders for sets.
const defaultSetSortOrders: Record<string, OrderDirection> = {
  releaseDate: OrderDirection.Desc,
  name: OrderDirection.Asc,
};

interface SetsListProps {
  initialSets: PokemonSetItemFragment[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
  sortBy: TcgSetSortByT;
  sortOrder: OrderDirection;
  initialSearchQuery?: string;
}

export default function SetsList({
  initialSets,
  tcgLang,
  tcgBrand,
  tcgCategory,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
  initialSearchQuery = "",
}: SetsListProps) {
  const t = useTranslations();

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [manuallyRefetching, setManuallyRefetching] = useState(false);
  const [hasActiveSearch, setHasActiveSearch] = useState(!!initialSearchQuery);

  // 2) Local state for sorting.
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // 3) When the sort key changes, update both sortBy and sortOrder (using our mapping).
  const handleSortByChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(defaultSetSortOrders[newSortBy] || OrderDirection.Asc);
  }, []);

  // 4) Force re-mount of InfiniteList on changes.
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // Base where filter
  const baseWhereFilter = useMemo(
    () => ({
      language: { equals: tcgLang },
      ...(tcgCategory === "booster-packs" && {
        isBoosterPack: { equals: true },
      }),
    }),
    [tcgLang, tcgCategory],
  );

  // 5) Apollo query.
  const { data, loading, fetchMore, refetch } = useGetPokemonSetsQuery({
    variables: {
      where: {
        ...baseWhereFilter,
        ...(initialSearchQuery
          ? buildSearchPokemonSetFilter(initialSearchQuery)
          : {}),
      },
      orderBy: [{ [sortBy]: sortOrder }],
      take: POKEMON_SETS_PAGE_SIZE,
      skip: 0,
    },
  });

  // 6) Current sets (fallback to initialSets if data isn't available yet).
  const sets = useMemo(
    () =>
      hasActiveSearch
        ? data?.pokemonSets || []
        : data?.pokemonSets?.length
          ? data.pokemonSets
          : initialSets,
    [hasActiveSearch, data?.pokemonSets, initialSets],
  );

  // Handle search changes
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setHasActiveSearch(!!query);

      // If manually clearing the search, refetch immediately
      if (searchQuery && !query) {
        setManuallyRefetching(true);

        refetch({
          where: baseWhereFilter,
          orderBy: [{ [sortBy]: sortOrder }],
          take: POKEMON_SETS_PAGE_SIZE,
          skip: 0,
        }).finally(() => {
          setManuallyRefetching(false);
        });
      }
    },
    [searchQuery, baseWhereFilter, sortBy, sortOrder, refetch],
  );

  // Debounced search effect
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery === searchQuery) {
      setManuallyRefetching(true);
      setHasActiveSearch(true);

      const searchFilter = buildSearchPokemonSetFilter(debouncedSearchQuery);

      refetch({
        where: {
          ...baseWhereFilter,
          ...searchFilter,
        },
        orderBy: [{ [sortBy]: sortOrder }],
        take: POKEMON_SETS_PAGE_SIZE,
        skip: 0,
      }).finally(() => {
        setManuallyRefetching(false);
      });
    }
  }, [
    debouncedSearchQuery,
    searchQuery,
    baseWhereFilter,
    sortBy,
    sortOrder,
    refetch,
  ]);

  // 7) Fetch more sets for infinite scroll.
  const fetchMoreSets = useCallback(
    async (offset: number) => {
      const { data: moreData } = await fetchMore({
        variables: { skip: offset },
      });
      return moreData?.pokemonSets ?? [];
    },
    [fetchMore],
  );

  // Calculate loading state
  const isLoading = loading || manuallyRefetching;

  // 8) Render.
  return (
    <div className="pt-2">
      {data?.pokemonSets && (
        <SetsHeader sets={data?.pokemonSets} tcgCategory={tcgCategory} />
      )}

      <FilterBar
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_SETS_SORT_OPTIONS}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      {isLoading ? (
        <div className="w-full flex items-center justify-center py-36">
          <Spinner />
        </div>
      ) : sets.length === 0 ? (
        <div className="w-full flex items-center justify-center py-36 flex-col gap-4">
          <p className="text-gray-500">
            {hasActiveSearch
              ? t("sets-page.no-search-results")
              : t("sets-page.no-sets")}
          </p>
        </div>
      ) : (
        <SetsGrid>
          <InfiniteList<PokemonSetItemFragment>
            key={resetKey}
            initialItems={sets}
            fetchMore={fetchMoreSets}
            pageSize={POKEMON_SETS_PAGE_SIZE}
            renderItem={(item) => (
              <SetCard
                key={item.id}
                set={item}
                href={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${item.tcgSetId}`}
              />
            )}
          />
        </SetsGrid>
      )}
    </div>
  );
}
