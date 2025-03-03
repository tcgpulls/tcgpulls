import PageNavigation from "@/components/navigation/PageNavigation";
import { UrlParamsT } from "@/types/Params";
import { getPokemonCard } from "@/lib/tcg/pokemon/getPokemonCard";
import { getTranslations } from "next-intl/server";
import BasicInfo from "@/components/tcg/pokemon/card-page/BasicInfo";
import CardImage from "@/components/tcg/pokemon/card-page/CardImage";
import { GET_USER_POKEMON_COLLECTION_ITEMS_FOR_CARD } from "@/graphql/tcg/pokemon/collection/queries";
import { OrderDirection, PokemonCollectionItem } from "@/graphql/generated";
import { auth } from "@/auth";
import createApolloClient from "@/lib/clients/createApolloClient";
import CollectionDetails from "@/components/tcg/pokemon/collection/CollectionDetails";
import Tabs from "@/components/misc/Tabs";
import CardDetails from "@/components/tcg/pokemon/card-page/CardDetails";

interface Props {
  params: UrlParamsT;
}

const PokemonCardPage = async ({ params }: Props) => {
  const { tcgBrand, tcgCategory, tcgLang, cardSlug } = await params;
  const session = await auth();
  const t = await getTranslations();

  const client = createApolloClient(
    !session?.user?.id ? session?.user?.id : undefined
  );

  try {
    const card = await getPokemonCard(cardSlug);
    if (!card) {
      return <p>{t("card-page.not-found")}</p>;
    }

    // Fetch ALL items (unchanged)
    const collectionResponse = await client.query({
      query: GET_USER_POKEMON_COLLECTION_ITEMS_FOR_CARD,
      variables: {
        where: { card: { id: { equals: card.id } } },
        orderBy: [{ acquiredAt: OrderDirection.Desc }],
        take: 999,
        skip: 0,
      },
    });

    const collectionItems: PokemonCollectionItem[] =
      collectionResponse.data?.pokemonCollectionItems ?? [];

    const { tcgSetId, set } = card;

    return (
      <>
        {/* PageNavigation */}
        <PageNavigation
          title={`${set?.name}`}
          size="small"
          withBackButton
          previousUrl={`/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${tcgSetId}`}
        />

        {/* Main Content Container */}
        <div className="flex gap-8 py-4 md:py-6">
          {/* Left Column: Card Image */}
          <div className="min-w-[460px]">
            <CardImage card={card} />
          </div>

          {/* Right Column: Card Info */}
          <div className="flex flex-col gap-4 grow">
            <BasicInfo card={card} tcgLang={tcgLang!} />

            {/*<Divider />*/}

            <Tabs
              tabs={[
                {
                  label: t("common.collection"),
                  content: (
                    <div>
                      <CollectionDetails collectionItems={collectionItems} />
                    </div>
                  ),
                },
                {
                  label: t("common.details"),
                  content: (
                    <div className={`max-w-[640px]`}>
                      <CardDetails card={card} />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    if (error instanceof Error) {
      return (
        <p className="text-red-600">
          {t("common.error")}: {error.message}
        </p>
      );
    }
    return <p className="text-red-600">{t("common.error")}</p>;
  }
};

export default PokemonCardPage;
