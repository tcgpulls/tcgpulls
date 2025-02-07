"use client";

import React, { useState, useEffect } from "react";
import CardsGrid from "@/components/misc/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import CardCard from "@/components/tcg/CardCard";
import Spinner from "@/components/misc/Spinner";

import {
  OrderDirection,
  PokemonCardItemFragment,
  useGetPokemonCardsQuery,
} from "@/graphql/generated";
import { TcgCardSortByT, TcgLangT } from "@/types/Tcg";
import {
  POKEMON_CARDS_PAGE_SIZE,
  POKEMON_CARDS_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";

import { FilterBar } from "@/components/navigation/FilterBar";

interface CardsListProps {
  initialCards: PokemonCardItemFragment[];
  tcgLang: TcgLangT;
  setId: string;
  sortBy: TcgCardSortByT; // or TcgSetSortByT if you have a specialized type
  sortOrder: OrderDirection;
}

export function CardsList({
  initialCards,
  tcgLang,
  setId,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
}: CardsListProps) {
  // 1) Local sort state
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // 2) "resetKey" forces <InfiniteList> to re-mount on sort changes
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // 3) Run the same GraphQL query to get the updated list
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
    // Optionally ensure fresh data:
    // fetchPolicy: "cache-and-network",
  });

  // 4) If the new query is empty at first, use SSR fallback
  const cards = data?.pokemonCards?.length ? data.pokemonCards : initialCards;

  // 5) "fetchMore" callback for <InfiniteList>
  const fetchMoreCards = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: { skip: offset },
    });
    return moreData?.pokemonCards ?? [];
  };

  // (Optional) Loading / empty states
  if (loading && !data) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner />
      </div>
    );
  }
  if (!cards.length) {
    return <p>No cards found</p>;
  }

  return (
    <div className="pt-2">
      {/* 6) FilterBar for user-driven sorting */}
      <FilterBar
        sortBy={sortBy}
        onSortByChange={(value) => setSortBy(value)}
        sortOrder={sortOrder}
        onSortOrderChange={(value) => setSortOrder(value)}
        sortOptions={POKEMON_CARDS_SORT_OPTIONS} // e.g. ["normalizedNumber"]
      />

      <CardsGrid>
        <InfiniteList<PokemonCardItemFragment>
          key={resetKey} // Force re-mount on each sort change
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
    </div>
  );
}

export default CardsList;
