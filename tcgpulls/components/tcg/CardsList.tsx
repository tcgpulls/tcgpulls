"use client";

import React from "react";
import CardsGrid from "@/components/misc/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import { PokemonCard } from "@prisma/client";
import CardCard from "@/components/tcg/CardCard";
import { getCards } from "@/actions/getCards";
import { TcgLangT, TcgSortOrderT, TcgBrandT } from "@/types/Tcg";

interface CardsListProps {
  initialCards: PokemonCard[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  setId: string;
  sortBy: string;
  sortOrder: TcgSortOrderT;
}

const PAGE_SIZE = 24;

export function CardsList({
  initialCards,
  tcgLang,
  tcgBrand,
  setId,
  sortBy,
  sortOrder,
}: CardsListProps) {
  const fetchMoreCards = async (offset: number) => {
    return await getCards({
      tcgLang,
      tcgBrand,
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
            href={`/app/tcg/pokemon/${tcgLang}/cards/${card.cardId}`}
          />
        )}
      />
    </CardsGrid>
  );
}

export default CardsList;
