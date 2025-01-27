import Header from "@/components/misc/Header";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import {
  GetPokemonCardQuery,
  GetPokemonCardQueryVariables,
} from "@/graphql/generated";
import { GET_POKEMON_CARD } from "@/graphql/tcg/pokemon/cards/queries";
import createApolloClient from "@/lib/clients/createApolloClient";

interface Props {
  params: UrlParamsT;
}

const CardPage = async ({ params }: Props) => {
  const { locale, tcgBrand, tcgCategory, tcgLang, cardSlug } = await params;
  const client = createApolloClient();

  if (!cardSlug) {
    notFound();
  }

  // const card = await getCard({ tcgBrand, tcgLang, cardSlug });

  const { data: cardData, error: cardError } = await client.query<
    GetPokemonCardQuery,
    GetPokemonCardQueryVariables
  >({
    query: GET_POKEMON_CARD,
    variables: {
      where: {
        tcgCardId_variant_language: cardSlug,
      },
    },
  });

  if (cardError) {
    return <p>Error fetching card: {cardError.message}</p>;
  }

  const card = cardData?.pokemonCard;

  if (!card) {
    return <p>No card found</p>;
  }

  return (
    <>
      <Header
        title={`${card.name} (${card.tcgCardId})`}
        size={`small`}
        withBackButton
        previousUrl={`/${locale}/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${card.tcgSetId}`}
      />
      <Image
        src={
          card.imageLargeStorageUrl
            ? assetsUrl(card.imageLargeStorageUrl!)
            : card.imageLargeApiUrl
              ? card.imageLargeApiUrl
              : "https://placehold.co/420x586"
        }
        className="w-full max-w-[420px] object-contain mb-4 rounded-[20px]"
        alt={`${card.name} card`}
        width={420}
        height={586}
      />
    </>
  );
};

export default CardPage;
