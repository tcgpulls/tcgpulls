import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import {
  POKEMON_CARDS_PAGE_SIZE,
  POKEMON_CARDS_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";
import {
  GetPokemonCardsQuery,
  GetPokemonCardsQueryVariables,
  GetPokemonSetQuery,
  GetPokemonSetQueryVariables,
  OrderDirection,
} from "@/graphql/generated";
import { GET_POKEMON_CARDS } from "@/graphql/tcg/pokemon/cards/queries";
import { GET_POKEMON_SET } from "@/graphql/tcg/pokemon/sets/queries";
import createApolloClient from "@/lib/clients/createApolloClient";
import { getTranslations } from "next-intl/server";
import CardsList from "@/components/tcg/CardsList";
import Header from "@/components/misc/Header";
import { Divider } from "@/components/catalyst-ui/divider";

interface Props {
  params: UrlParamsT;
}

export default async function SetCardsPage({ params }: Props) {
  const { setId, tcgLang, tcgBrand, tcgCategory } = await params;
  const client = createApolloClient();
  const t = await getTranslations();

  // Validate
  if (!setId || !tcgBrand || !tcgLang || !tcgCategory) {
    notFound();
  }

  // 1) Fetch the set
  const { data: setData, error: setError } = await client.query<
    GetPokemonSetQuery,
    GetPokemonSetQueryVariables
  >({
    query: GET_POKEMON_SET,
    variables: {
      where: {
        tcgSetId_language: `${setId}-${tcgLang}`,
      },
    },
  });

  if (setError) {
    return <p>Error fetching set: {setError.message}</p>;
  }

  const set = setData?.pokemonSet;
  if (!set) {
    return <p>No set found</p>;
  }

  const sortBy = POKEMON_CARDS_SORT_OPTIONS[0]; // default sort
  const sortOrder: OrderDirection = OrderDirection.Desc; // default order

  // 3) Fetch initial cards with your default sorting
  const { data: cardsData, error: cardsError } = await client.query<
    GetPokemonCardsQuery,
    GetPokemonCardsQueryVariables
  >({
    query: GET_POKEMON_CARDS,
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

  if (cardsError) {
    return <p>Error: {cardsError.message}</p>;
  }

  if (!cardsData?.pokemonCards?.length) {
    return (
      <>
        <Header
          title={t(`common.${tcgCategory}`)}
          size="small"
          withBackButton
          previousUrl={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}`}
        />
        <p>{t("cards-page.no-cards")}</p>
      </>
    );
  }

  return (
    <>
      <Header
        title={t(`common.${tcgCategory}`)}
        size="small"
        withBackButton
        previousUrl={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}`}
      />
      <Divider />
      <CardsList
        // The initial SSR data
        initialCards={cardsData.pokemonCards}
        // IDs and sort info
        tcgBrand={tcgBrand}
        tcgLang={tcgLang}
        tcgCategory={tcgCategory}
        setId={setId}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
}
