import SetsList from "@/components/tcg/SetsList";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { GET_POKEMON_SETS } from "@/graphql/tcg/pokemon/sets/queries";
import {
  GetPokemonSetsQuery,
  GetPokemonSetsQueryVariables,
  OrderDirection,
} from "@/graphql/generated";
import { POKEMON_SETS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import Header from "@/components/misc/Header";
import createApolloClient from "@/lib/clients/createApolloClient";

interface Props {
  params: UrlParamsT;
}

const TcgTypeSetsPage = async ({ params }: Props) => {
  const { locale, tcgLang, tcgBrand, tcgCategory } = await params;
  const client = createApolloClient();
  const t = await getTranslations("common");

  const sortBy = "releaseDate";
  const sortOrder: OrderDirection = OrderDirection.Desc;

  if (!tcgBrand || !tcgCategory || !tcgLang) {
    notFound();
  }

  const { data, error } = await client.query<
    GetPokemonSetsQuery,
    GetPokemonSetsQueryVariables
  >({
    query: GET_POKEMON_SETS,
    variables: {
      where: {
        language: { equals: tcgLang },
        ...(tcgCategory === "booster-packs" && {
          isBoosterPack: { equals: true },
        }),
      },
      orderBy: [{ [sortBy]: sortOrder }],
      take: POKEMON_SETS_PAGE_SIZE,
      skip: 0,
    },
  });

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data?.pokemonSets) {
    return <p>No sets found</p>;
  }

  return (
    <>
      <Header
        title={t(`${tcgBrand}`)}
        size={`small`}
        withBackButton
        previousUrl={`/${locale}/app/tcg/${tcgBrand}/${tcgLang}`}
      />
      <SetsList
        key={`${sortBy}-${sortOrder}`}
        initialSets={data.pokemonSets}
        tcgLang={tcgLang}
        tcgBrand={tcgBrand}
        tcgCategory={tcgCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default TcgTypeSetsPage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
