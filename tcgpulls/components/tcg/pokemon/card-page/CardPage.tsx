import PageNavigation from "@/components/navigation/PageNavigation";
import { SearchParamsT, UrlParamsT } from "@/types/Params";
import { getPokemonCard } from "@/lib/tcg/pokemon/getPokemonCard";
import { getTranslations } from "next-intl/server";
import BasicInfo from "@/components/tcg/pokemon/card-page/BasicInfo";
import CardImage from "@/components/tcg/pokemon/card-page/CardImage";
import { GET_USER_POKEMON_COLLECTION_ITEMS_FOR_CARD } from "@/graphql/tcg/pokemon/collection/queries";
import {
  OrderDirection,
  PokemonCollectionItem,
  PokemonSet,
} from "@/graphql/generated";
import { auth } from "@/auth";
import createApolloClient from "@/lib/clients/createApolloClient";
import CollectionDetails from "@/components/tcg/pokemon/collection/CollectionDetails";
import Tabs from "@/components/misc/Tabs";
import CardDetails from "@/components/tcg/pokemon/card-page/CardDetails";
import { assetsUrl } from "@/utils/assetsUrl";
import Image from "next/image";
import { TcgLangT } from "@/types/Tcg";
import { ReactNode } from "react";

interface Props {
  params: UrlParamsT;
  searchParams: SearchParamsT;
}

const PageNavigationImage = ({
  set,
  lang,
}: {
  set: PokemonSet;
  lang: TcgLangT;
}): ReactNode => {
  if (!set || !lang) return null;

  return (
    <p className="flex items-center gap-4 text-sm text-gray-400 min-w-0">
      <Image
        width={100}
        height={46}
        src={assetsUrl(`img/tcg/pokemon/sets/${lang}/${set.tcgSetId}/logo.png`)}
        alt={`${set.name} - ${set.series}`}
      />
      <span className="truncate">
        {set.name} - {set.series}
      </span>
    </p>
  );
};

const PokemonCardPage = async ({ params, searchParams }: Props) => {
  const { tcgBrand, tcgCategory, tcgLang, cardSlug } = await params;
  const { fromPage } = await searchParams;
  const session = await auth();
  const t = await getTranslations();

  const client = createApolloClient(
    !session?.user?.id ? session?.user?.id : undefined,
  );

  try {
    const card = await getPokemonCard(cardSlug);
    if (!card) {
      return <p>{t("card-page.not-found")}</p>;
    }

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

    const pageNavigationTitle =
      fromPage === "collection"
        ? t("common.collection")
        : set && tcgLang && <PageNavigationImage set={set} lang={tcgLang} />;
    const pageNavigationUrl =
      fromPage === "collection"
        ? `/app/tcg/${tcgBrand}/${tcgLang}/collection`
        : `/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${tcgSetId}`;

    return (
      <>
        <PageNavigation
          title={pageNavigationTitle}
          size="small"
          withBackButton
          previousUrl={pageNavigationUrl}
        />

        {/* Main Content Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 py-4 md:py-6">
          {/* Card Image - Full width on mobile, fixed width on bigger screens */}
          <div className="w-full md:w-auto md:min-w-[460px]">
            {/* BasicInfo for Mobile Only - Shows above image */}
            <div className="block md:hidden py-2 pb-6">
              <BasicInfo card={card} />
            </div>
            <div className="flex flex-col items-center">
              <CardImage card={card} />
            </div>
          </div>

          {/* Right Column: Card Info - Full width on all screens with proper min-width for overflow handling */}
          <div className="w-full min-w-0 flex flex-col gap-8">
            {/* BasicInfo for Desktop Only - Shows next to image */}
            <div className="hidden md:block">
              <BasicInfo card={card} />
            </div>

            <div className="w-full min-w-0">
              <Tabs
                tabs={[
                  {
                    label: t("common.collection"),
                    content: (
                      <div className="w-full">
                        <CollectionDetails collectionItems={collectionItems} />
                      </div>
                    ),
                  },
                  {
                    label: t("common.details"),
                    content: (
                      <div className="w-full max-w-full md:max-w-[640px]">
                        <CardDetails card={card} />
                      </div>
                    ),
                  },
                ]}
              />
            </div>
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
