"use client";

import React from "react";
import SetCard from "@/components/tcg/SetCard";
import CardsGrid from "@/components/misc/CardsGrid";
import { PokemonSet } from "@prisma/client";
import { getSets } from "@/actions/getSets";
import InfiniteList from "@/components/misc/InfiniteList";
import {
  TcgCategoryT,
  TcgLangT,
  TcgSortByT,
  TcgSortOrderT,
  TcgTypeT,
} from "@/types/Tcg";

interface SetsListProps {
  initialSets: PokemonSet[];
  tcgLang: TcgLangT;
  tcgType: TcgTypeT;
  tcgCategory: TcgCategoryT;
  sortBy: TcgSortByT;
  sortOrder: TcgSortOrderT;
}

const PAGE_SIZE = 24;

export function SetsList({
  initialSets,
  tcgLang,
  tcgType,
  tcgCategory,
  sortBy,
  sortOrder,
}: SetsListProps) {
  const fetchMoreSets = async (offset: number) => {
    return await getSets({
      tcgLang,
      tcgType,
      tcgCategory,
      offset,
      limit: PAGE_SIZE,
      sortBy,
      sortOrder,
    });
  };

  return (
    <CardsGrid>
      <InfiniteList<PokemonSet>
        initialItems={initialSets}
        fetchMore={fetchMoreSets}
        pageSize={PAGE_SIZE}
        renderItem={(set) => (
          <SetCard
            key={set.id}
            set={set}
            href={`/app/tcg/${tcgType}/${tcgLang}/${tcgCategory}/${set.setId}`}
          />
        )}
      />
    </CardsGrid>
  );
}

export default SetsList;
