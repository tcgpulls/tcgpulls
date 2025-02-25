"use client";

import React, { useEffect, useState } from "react";
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

// 1. Define a mapping for default sort orders for sets.
// For example, you might want "releaseDate" to be descending (most recent first)
// and "name" to be ascending (A → Z).
const defaultSetSortOrders: Record<string, OrderDirection> = {
  releaseDate: OrderDirection.Desc,
  name: OrderDirection.Asc,
  // Add additional sort keys as needed.
};

interface SetsListProps {
  initialSets: PokemonSetItemFragment[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
  sortBy: TcgSetSortByT;
  sortOrder: OrderDirection;
}

export default function SetsList({
  initialSets,
  tcgLang,
  tcgBrand,
  tcgCategory,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
}: SetsListProps) {
  // 2) Local state for sorting.
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // 3) When the sort key changes, update both sortBy and sortOrder (using our mapping).
  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(defaultSetSortOrders[newSortBy] || OrderDirection.Asc);
  };

  // 4) Force re-mount of InfiniteList on changes.
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // 5) Apollo query.
  const { data, loading, fetchMore } = useGetPokemonSetsQuery({
    variables: {
      where: {
        language: { equals: tcgLang },
        ...(tcgCategory === "booster-packs" && {
          isBoosterPack: { equals: true },
        }),
      },
      orderBy: [{ [sortBy]: sortOrder }],
      take: POKEMON_SETS_PAGE_SIZE,
      skip: 0,
    },
  });

  // 6) Current sets (fallback to initialSets if data isn’t available yet).
  const sets = data?.pokemonSets?.length ? data.pokemonSets : initialSets;

  // 7) Fetch more sets for infinite scroll.
  const fetchMoreSets = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: { skip: offset },
    });
    return moreData?.pokemonSets ?? [];
  };

  // 8) Render.
  return (
    <div className="pt-2">
      {data?.pokemonSets && (
        <SetsHeader sets={data?.pokemonSets} tcgCategory={tcgCategory} />
      )}

      {/* Render FilterBar with our custom sort key change handler */}
      <FilterBar
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_SETS_SORT_OPTIONS} // e.g. ["releaseDate", "name"]
      />

      {loading ? (
        <div className="w-full flex items-center justify-center py-36">
          <Spinner />
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
