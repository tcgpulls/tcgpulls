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
import Spinner from "@/components/misc/Spinner";
import { useTranslations } from "use-intl";

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
  const t = useTranslations("card-page");
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
    return (
      <div className={`py-10 flex justify-center`}>
        <Spinner />
      </div>
    );
  }

  if (!data?.pokemonCards) {
    return <p>{t("not-found")}</p>;
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
