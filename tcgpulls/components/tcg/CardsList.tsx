"use client";

import React from "react";
import CardsGrid from "@/components/misc/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import { PokemonCard } from "@prisma/client";
import CardCard from "@/components/tcg/CardCard";
import { getCards } from "@/actions/getCards";
import { TcgLangT, TcgSortOrderT, TcgTypeT } from "@/types/Tcg";

interface CardsListProps {
  initialCards: PokemonCard[];
  tcgLang: TcgLangT;
  tcgType: TcgTypeT;
  setId: string;
  sortBy: string;
  sortOrder: TcgSortOrderT;
}

const PAGE_SIZE = 24;

export function CardsList({
  initialCards,
  tcgLang,
  tcgType,
  setId,
  sortBy,
  sortOrder,
}: CardsListProps) {
  const fetchMoreCards = async (offset: number) => {
    return await getCards({
      tcgLang,
      tcgType,
      setIds: [setId],
      offset,
      limit: PAGE_SIZE,
      sortBy,
      sortOrder,
    });
  };

  return (
    <CardsGrid>
      <InfiniteList<PokemonCard>
        initialItems={initialCards}
        fetchMore={fetchMoreCards}
        pageSize={PAGE_SIZE}
        renderItem={(card) => (
          <CardCard
            key={card.id}
            card={card}
            href={`/app/tcg/pokemon/cards/${card.cardId}`}
          />
        )}
      />
    </CardsGrid>
  );
}

export default CardsList;
