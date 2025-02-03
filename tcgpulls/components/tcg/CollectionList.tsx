"use client";

import React from "react";
import CardsGrid from "@/components/misc/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import CardCard from "@/components/tcg/CardCard";
import { TcgLangT, TcgSortOrderT } from "@/types/Tcg";
import {
  PokemonCollectionItem,
  useGetUserPokemonCollectionItemsQuery,
} from "@/graphql/generated"; // or the auto-gen type
import { POKEMON_CARDS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import Spinner from "@/components/misc/Spinner";

interface CollectionListProps {
  userId: string;
  setId?: string;
  tcgLang: TcgLangT;
  sortBy: string;
  sortOrder: TcgSortOrderT;
  initialItems: PokemonCollectionItem[];
}

export default function CollectionList({
  userId,
  setId,
  tcgLang,
  sortBy,
  sortOrder,
  initialItems,
}: CollectionListProps) {
  const { data, loading, fetchMore } = useGetUserPokemonCollectionItemsQuery({
    variables: {
      where: {
        user: { id: { equals: userId } },
        card: {
          // Only if you want to filter by set:
          set: {
            tcgSetId: { equals: setId },
            language: { equals: tcgLang },
          },
        },
      },
      orderBy: [{ [sortBy]: sortOrder }],
      skip: 0,
      take: POKEMON_CARDS_PAGE_SIZE,
    },
  });

  const fetchMoreItems = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: {
        skip: offset,
      },
    });
    return moreData?.pokemonCollectionItems ?? [];
  };

  if (loading && !data) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <CardsGrid>
      <InfiniteList<PokemonCollectionItem>
        initialItems={initialItems}
        fetchMore={fetchMoreItems}
        pageSize={POKEMON_CARDS_PAGE_SIZE}
        renderItem={(item) => {
          const card = item.card;
          if (!card) return null;
          return (
            <CardCard
              key={card.id}
              card={card}
              href={`/app/tcg/pokemon/${tcgLang}/sets/${card.tcgSetId}/cards/${card.tcgCardId}-${card.variant}-${tcgLang}`}
            />
          );
        }}
      />
    </CardsGrid>
  );
}
