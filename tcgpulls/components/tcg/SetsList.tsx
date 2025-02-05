"use client";

import React from "react";
import SetCard from "@/components/tcg/SetCard";
import InfiniteList from "@/components/misc/InfiniteList";
import {
  TcgBrandT,
  TcgCategoryT,
  TcgLangT,
  TcgSortByT,
  TcgSortOrderT,
} from "@/types/Tcg";
import {
  PokemonSetItemFragment,
  useGetPokemonSetsQuery,
} from "@/graphql/generated";
import { POKEMON_SETS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import SetsGrid from "@/components/misc/SetsGrid";
import Spinner from "@/components/misc/Spinner";

interface SetsListProps {
  initialSets: PokemonSetItemFragment[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
  sortBy: TcgSortByT;
  sortOrder: TcgSortOrderT;
}

export function SetsList({
  initialSets,
  tcgLang,
  tcgBrand,
  tcgCategory,
  sortBy,
  sortOrder,
}: SetsListProps) {
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

  const fetchMoreSets = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: { skip: offset },
    });
    return moreData?.pokemonSets ?? [];
  };

  if (loading) {
    return <Spinner />;
  }

  if (!data?.pokemonSets) {
    return <p>No sets found</p>;
  }

  return (
    <SetsGrid>
      <InfiniteList<PokemonSetItemFragment>
        initialItems={initialSets}
        fetchMore={fetchMoreSets}
        pageSize={POKEMON_SETS_PAGE_SIZE}
        renderItem={(set) => (
          <SetCard
            key={set.id}
            set={set}
            href={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${set.tcgSetId}`}
          />
        )}
      />
    </SetsGrid>
  );
}

export default SetsList;
