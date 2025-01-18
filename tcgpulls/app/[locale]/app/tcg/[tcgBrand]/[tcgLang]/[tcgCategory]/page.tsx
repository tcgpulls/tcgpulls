import SetsList from "@/components/tcg/SetsList";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { Heading } from "@/components/catalyst-ui/heading";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import client from "@/lib/apolloClient"; // Your Apollo Client instance
import { GET_POKEMON_SETS } from "@/graphql/tcg/pokemon/sets/queries";
import {
  GetPokemonSetsQuery,
  GetPokemonSetsQueryVariables,
  OrderDirection,
} from "@/graphql/generated";
import { POKEMON_SETS_PAGE_SIZE } from "@/constants/tcg/pokemon";

interface Props {
  params: UrlParamsT;
}

const TcgTypeSetsPage = async ({ params }: Props) => {
  const { tcgLang, tcgBrand, tcgCategory } = await params;
  const t = await getTranslations();

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
    return <p>{t("common.noSetsFound")}</p>;
  }

  return (
    <>
      <Heading className="pb-6">{t(`common.${tcgCategory}`)}</Heading>
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
