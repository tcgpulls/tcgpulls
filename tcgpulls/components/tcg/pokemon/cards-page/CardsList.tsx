"use client";

import React, { useEffect, useState } from "react";
import CardsGrid from "@/components/tcg/pokemon/cards-page/CardsGrid";
import InfiniteList from "@/components/misc/InfiniteList";
import CardCard from "@/components/tcg/pokemon/cards-page/CardCard";
import Spinner from "@/components/misc/Spinner";

import {
  OrderDirection,
  PokemonCardItemFragment,
  PokemonSetItemFragment,
  useGetPokemonCardsQuery,
} from "@/graphql/generated";
import { TcgBrandT, TcgCardSortByT, TcgCategoryT, TcgLangT } from "@/types/Tcg";
import {
  POKEMON_CARDS_PAGE_SIZE,
  POKEMON_CARDS_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";
import { FilterBar } from "@/components/navigation/FilterBar";
import { useTranslations } from "use-intl";
import { Button } from "@/components/catalyst-ui/button";
import EmptyList from "@/components/misc/EmptyList";
import CardsHeader from "@/components/tcg/pokemon/cards-page/CardsHeader";

// Even if both default orders are ascending, we can still define a mapping
// to keep the code consistent and extensible.
const defaultCardsSortOrders: Record<string, OrderDirection> = {
  normalizedNumber: OrderDirection.Desc,
  name: OrderDirection.Asc,
  // If you have additional sort keys, define their defaults here.
};

interface CardsListProps {
  initialCards: PokemonCardItemFragment[];
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
  set: PokemonSetItemFragment;
  sortBy: TcgCardSortByT;
  sortOrder: OrderDirection;
}

export function CardsList({
  initialCards,
  tcgBrand,
  tcgLang,
  tcgCategory,
  set,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
}: CardsListProps) {
  const t = useTranslations();
  // 1) Local sort state.
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(initialSortOrder);

  // 2) When the sort key changes, update both sortBy and sortOrder (defaulting to Asc).
  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(defaultCardsSortOrders[newSortBy] || OrderDirection.Asc);
  };

  // 3) "resetKey" forces <InfiniteList> to re-mount on sort changes.
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((prev) => prev + 1);
  }, [sortBy, sortOrder]);

  // 4) Execute the GraphQL query using the current sort state.
  const { data, loading, fetchMore } = useGetPokemonCardsQuery({
    variables: {
      where: {
        set: {
          tcgSetId: { equals: set.tcgSetId },
          language: { equals: tcgLang },
        },
      },
      orderBy: [{ [sortBy]: sortOrder }],
      take: POKEMON_CARDS_PAGE_SIZE,
      skip: 0,
    },
    // Optionally, you can set fetchPolicy to "cache-and-network" if needed.
  });

  // 5) Use SSR fallback if data is not available yet.
  const cards = data?.pokemonCards?.length ? data.pokemonCards : initialCards;

  // 6) "fetchMore" callback for infinite scroll.
  const fetchMoreCards = async (offset: number) => {
    const { data: moreData } = await fetchMore({
      variables: { skip: offset },
    });
    return moreData?.pokemonCards ?? [];
  };

  if (!cards.length) {
    return <p>{t("card-page.no-cards")}</p>;
  }

  return (
    <div className="pt-2">
      <CardsHeader set={set} />

      {/* 7) Render the FilterBar with our custom handler */}
      <FilterBar
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={POKEMON_CARDS_SORT_OPTIONS} // e.g. ["normalizedNumber"]
      />

      {loading ? (
        <div className="w-full flex items-center justify-center py-36">
          <Spinner />
        </div>
      ) : cards.length === 0 ? (
        <EmptyList text={t("cards-page.no-cards")}>
          <Button href={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}`}>
            {t("common.view")} {t("common.pokemon")} {t("common.collectibles")}
          </Button>
        </EmptyList>
      ) : (
        <CardsGrid>
          <InfiniteList<PokemonCardItemFragment>
            key={resetKey} // Force re-mount on each sort change.
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
      )}
    </div>
  );
}

export default CardsList;
