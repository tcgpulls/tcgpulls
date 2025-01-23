import PageHeader from "@/components/misc/PageHeader";
import CardsList from "@/components/tcg/CardsList";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { POKEMON_CARDS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import {
  GetPokemonCardsQuery,
  GetPokemonCardsQueryVariables,
  GetPokemonSetQuery,
  GetPokemonSetQueryVariables,
  OrderDirection,
} from "@/graphql/generated";
import client from "@/lib/clients/apolloClient";
import { GET_POKEMON_CARDS } from "@/graphql/tcg/pokemon/cards/queries";
import { GET_POKEMON_SET } from "@/graphql/tcg/pokemon/sets/queries";

interface Props {
  params: UrlParamsT;
}

const SetCardsPage = async ({ params }: Props) => {
  const { locale, setId, tcgLang, tcgBrand, tcgCategory } = await params;

  // Validate
  if (!setId || !tcgBrand || !tcgLang) {
    notFound();
  }

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

  const ThisHeader = () => {
    return (
      <PageHeader
        title={`${set.name} (${set.tcgSetId})`}
        withBackButton
        previousUrl={`/${locale}/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}`}
      />
    );
  };

  // 2) Define your desired sorting
  const sortBy = "normalizedNumber";
  const sortOrder = OrderDirection.Asc;

  // 3) Fetch initial cards from GraphQL
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

  if (!cardsData?.pokemonCards?.length || cardsData.pokemonCards.length === 0) {
    return (
      <>
        <ThisHeader />
        <p>No cards found</p>
      </>
    );
  }

  return (
    <>
      <ThisHeader />
      <CardsList
        key={`${sortBy}-${sortOrder}`}
        initialCards={cardsData.pokemonCards}
        tcgLang={tcgLang}
        tcgBrand={tcgBrand}
        setId={setId}
        sortBy={sortBy}
        sortOrder={sortOrder} // or convert to "asc"/"desc" if needed
      />
    </>
  );
};

export default SetCardsPage;
