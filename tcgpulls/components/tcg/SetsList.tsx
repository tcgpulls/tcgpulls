"use client";

import React, { useEffect, useState } from "react";
import InfiniteList from "@/components/misc/InfiniteList";
import SetCard from "@/components/tcg/SetCard";
import SetsGrid from "@/components/misc/SetsGrid";

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
  // 1) Local state for sorting
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // 2) Force re-mount of InfiniteList on changes
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // 3) Apollo query
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

  // 4) Our current sets
  // If data is undefined on first render, fallback to initialSets
  // but once data arrives, prefer data from the query.
  const sets = data?.pokemonSets?.length ? data?.pokemonSets : initialSets;

  // 5) fetchMore for infinite scroll
  const fetchMoreSets = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: { skip: offset },
    });
    return moreData?.pokemonSets ?? [];
  };

  // 6) Rendering
  return (
    <div className={`pt-2`}>
      <FilterBar
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_SETS_SORT_OPTIONS} // e.g. ["releaseDate", "name"]
      />

      {loading ? (
        <div className={`w-full flex items-center justify-center py-36`}>
          <Spinner />
        </div>
      ) : (
        <SetsGrid>
          <InfiniteList<PokemonSetItemFragment>
            key={resetKey}
            // Pass current sets from the query (or SSR fallback)
            initialItems={sets}
            fetchMore={fetchMoreSets}
            pageSize={POKEMON_SETS_PAGE_SIZE}
            renderItem={(item) => {
              return (
                <SetCard
                  key={item.id}
                  set={item}
                  href={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${item.tcgSetId}`}
                />
              );
            }}
          />
        </SetsGrid>
      )}
    </div>
  );
}
