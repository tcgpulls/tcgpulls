"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import CardsGrid from "@/components/tcg/pokemon/cards-page/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import CardCard from "@/components/tcg/pokemon/cards-page/CardCard";
import Spinner from "@/components/misc/Spinner";

import {
  OrderDirection,
  PokemonCardItemFragment,
  PokemonSetItemFragment,
  useGetPokemonCardsQuery,
} from "@/graphql/generated";
import { TcgBrandT, TcgCardSortByT, TcgCategoryT, TcgLangT } from "@/types/Tcg";
import {
  POKEMON_CARDS_PAGE_SIZE,
  POKEMON_CARDS_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";
import { FilterBar } from "@/components/navigation/FilterBar";
import { useTranslations } from "use-intl";
import { Button } from "@/components/catalyst-ui/button";
import CardsHeader from "@/components/tcg/pokemon/cards-page/CardsHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { buildSearchPokemonCardFilter } from "@/graphql/tcg/pokemon/cards/filters";

// Even if both default orders are ascending, we can still define a mapping
// to keep the code consistent and extensible.
const defaultCardsSortOrders: Record<string, OrderDirection> = {
  normalizedNumber: OrderDirection.Desc,
  name: OrderDirection.Asc,
  // If you have additional sort keys, define their defaults here.
};

interface CardsListProps {
  initialCards: PokemonCardItemFragment[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
  set: PokemonSetItemFragment;
  sortBy: TcgCardSortByT;
  sortOrder: OrderDirection;
  initialSearchQuery?: string;
}

export function CardsList({
  initialCards,
  tcgBrand,
  tcgLang,
  tcgCategory,
  set,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
  initialSearchQuery = "",
}: CardsListProps) {
  const t = useTranslations();

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [manuallyRefetching, setManuallyRefetching] = useState(false);
  const [hasActiveSearch, setHasActiveSearch] = useState(!!initialSearchQuery);

  // 1) Local sort state.
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // 2) When the sort key changes, update both sortBy and sortOrder (defaulting to Asc).
  const handleSortByChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(defaultCardsSortOrders[newSortBy] || OrderDirection.Asc);
  }, []);

  // 3) "resetKey" forces <InfiniteList> to re-mount on sort changes.
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // Base filter for cards in this set
  const baseWhereFilter = useMemo(
    () => ({
      set: {
        tcgSetId: { equals: set.tcgSetId },
        language: { equals: tcgLang },
      },
    }),
    [set.tcgSetId, tcgLang],
  );

  // 4) Execute the GraphQL query using the current sort state.
  const { data, loading, fetchMore, refetch } = useGetPokemonCardsQuery({
    variables: {
      where: {
        ...baseWhereFilter,
        ...(initialSearchQuery
          ? buildSearchPokemonCardFilter(initialSearchQuery)
          : {}),
      },
      orderBy: [{ [sortBy]: sortOrder }],
      take: POKEMON_CARDS_PAGE_SIZE,
      skip: 0,
    },
  });

  // 5) Use SSR fallback if data is not available yet, but handle active search differently
  const cards = useMemo(
    () =>
      hasActiveSearch
        ? data?.pokemonCards || []
        : data?.pokemonCards?.length
          ? data.pokemonCards
          : initialCards,
    [hasActiveSearch, data?.pokemonCards, initialCards],
  );

  // 6) "fetchMore" callback for infinite scroll.
  const fetchMoreCards = useCallback(
    async (offset: number) => {
      const { data: moreData } = await fetchMore({
        variables: { skip: offset },
      });
      return moreData?.pokemonCards ?? [];
    },
    [fetchMore],
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
          take: POKEMON_CARDS_PAGE_SIZE,
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

      const searchFilter = buildSearchPokemonCardFilter(debouncedSearchQuery);

      refetch({
        where: {
          ...baseWhereFilter,
          ...searchFilter,
        },
        orderBy: [{ [sortBy]: sortOrder }],
        take: POKEMON_CARDS_PAGE_SIZE,
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

  // Calculate loading state
  const isLoading = loading || manuallyRefetching;

  return (
    <div className="pt-2">
      <CardsHeader set={set} />

      {/* Render the FilterBar with search functionality */}
      <FilterBar
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_CARDS_SORT_OPTIONS}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      {isLoading ? (
        <div className="w-full flex items-center justify-center py-36">
          <Spinner />
        </div>
      ) : cards.length === 0 ? (
        <div className="w-full flex items-center justify-center py-36 flex-col gap-4">
          <p className="text-gray-500">
            {hasActiveSearch
              ? t("cards-page.no-search-results")
              : t("cards-page.no-cards")}
          </p>
          {!hasActiveSearch && (
            <Button href={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}`}>
              {t("common.view")} {t("common.pokemon")}{" "}
              {t("common.collectibles")}
            </Button>
          )}
        </div>
      ) : (
        <CardsGrid>
          <InfiniteList<PokemonCardItemFragment>
            key={resetKey}
            initialItems={cards}
            fetchMore={fetchMoreCards}
            pageSize={POKEMON_CARDS_PAGE_SIZE}
            renderItem={(card) => (
              <CardCard
                key={card.id}
                card={card}
                href={`/app/tcg/pokemon/${tcgLang}/sets/${card.tcgSetId}/cards/${card.tcgCardId}-${card.variant}-${tcgLang}`}
              />
            )}
          />
        </CardsGrid>
      )}
    </div>
  );
}

export default CardsList;
