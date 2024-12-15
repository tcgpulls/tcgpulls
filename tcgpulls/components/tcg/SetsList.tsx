"use client";

import React from "react";
import SetCard from "@/components/tcg/SetCard";
import CardsGrid from "@/components/misc/CardsGrid";
import { PokemonSet } from "@prisma/client";
import { getSets } from "@/actions/getSets";
import InfiniteList from "@/components/misc/InfiniteList";

interface SetsListProps {
  initialSets: PokemonSet[];
  tcgType: string;
}

const PAGE_SIZE = 24;

export function SetsList({ initialSets, tcgType }: SetsListProps) {
  const fetchMoreSets = async (offset: number) => {
    return await getSets({ tcgType, offset, limit: PAGE_SIZE });
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
            href={`/app/tcg/pokemon/sets/${set.originalId}`}
          />
        )}
      />
    </CardsGrid>
  );
}

export default SetsList;
