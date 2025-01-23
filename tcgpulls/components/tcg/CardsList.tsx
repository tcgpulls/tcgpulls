"use client";

import React from "react";
import CardsGrid from "@/components/misc/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import CardCard from "@/components/tcg/CardCard";
import { TcgLangT, TcgSortOrderT, TcgBrandT } from "@/types/Tcg";
import {
  PokemonCardItemFragment,
  useGetPokemonCardsQuery,
} from "@/graphql/generated";
import { POKEMON_CARDS_PAGE_SIZE } from "@/constants/tcg/pokemon";

interface CardsListProps {
  initialCards: PokemonCardItemFragment[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  setId: string;
  sortBy: string;
  sortOrder: TcgSortOrderT;
}

export function CardsList({
  initialCards,
  tcgLang,
  setId,
  sortBy,
  sortOrder,
}: CardsListProps) {
  // 1) Run the same GraphQL query client-side for more data
  const { data, loading, fetchMore } = useGetPokemonCardsQuery({
    variables: {
      where: {
        set: {
          tcgSetId: { equals: setId },
          language: { equals: tcgLang },
        },
      },
      orderBy: [{ [sortBy]: sortOrder }],
      take: POKEMON_CARDS_PAGE_SIZE,
      skip: 0,
    },
  });

  const fetchMoreCards = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: { skip: offset },
    });
    return moreData?.pokemonCards ?? [];
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data?.pokemonCards) {
    return <p>No cards found</p>;
  }

  return (
    <CardsGrid>
      <InfiniteList<PokemonCardItemFragment>
        initialItems={initialCards}
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
  );
}

export default CardsList;
