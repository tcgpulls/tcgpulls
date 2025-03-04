import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import {
  POKEMON_COLLECTION_PAGE_SIZE,
  POKEMON_COLLECTION_SORT_OPTIONS,
} from "@/constants/tcg/pokemon";
import { OrderDirection, PokemonCollectionItem } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";
import { GET_USER_POKEMON_COLLECTION_ITEMS } from "@/graphql/tcg/pokemon/collection/queries";
import PageNavigation from "@/components/navigation/PageNavigation";
import { auth } from "@/auth";
import createApolloClient from "@/lib/clients/createApolloClient";
import CollectionList from "@/components/tcg/pokemon/collection/CollectionList";
import { requireAuthOrRedirect } from "@/auth/requireAuthOrRedirect";
import { RedirectReasons } from "@/types/Redirect";
import buildCollectionsOrderBy from "@/utils/buildCollectionsOrderBy";
import { Metadata } from "next";
import CollectionHeader from "@/components/tcg/pokemon/collection/CollectionHeader";

interface Props {
  params: UrlParamsT;
}

export default async function CollectionCardsPage({ params }: Props) {
  const { locale, setId, tcgLang, tcgBrand } = await params;
  const redirectReasonParam = `redirectReason=${RedirectReasons.NotAuthenticated}`;
  await requireAuthOrRedirect({
    redirectRoute: `/${locale}/app/tcg/${tcgBrand}/${tcgLang}/collection?${redirectReasonParam}`,
  });

  // 1) Validate & Auth
  if (!locale || !tcgBrand || !tcgLang) {
    notFound();
  }
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    notFound(); // or handle differently if needed
  }

  // 2) Create Apollo client for this user
  const client = createApolloClient(userId);

  // 3) Build the SSR query variables
  const whereFilter = {
    user: { id: { equals: userId } },
    card: {
      set: {
        tcgSetId: { equals: setId },
        language: { equals: tcgLang },
      },
    },
  };

  // 4) Choose a default sort
  const sortBy = POKEMON_COLLECTION_SORT_OPTIONS[0];
  const sortOrder = OrderDirection.Desc;
  const orderBy = buildCollectionsOrderBy(sortBy, sortOrder);

  // 5) Fetch initial items
  const { data, error } = await client.query({
    query: GET_USER_POKEMON_COLLECTION_ITEMS,
    variables: {
      where: whereFilter,
      orderBy,
      take: POKEMON_COLLECTION_PAGE_SIZE,
      skip: 0,
    },
  });

  if (error) {
    return <p>Error fetching collectionItems: {error.message}</p>;
  }

  const collectionItems = data?.pokemonCollectionItems || [];

  // 7) SSR done—render a header + the client component
  const t = await getTranslations();

  const collectionValue = collectionItems.reduce(
    (acc: number, item: PokemonCollectionItem) => acc + parseFloat(item.price),
    0,
  );

  return (
    <>
      <PageNavigation
        title={t(`common.tcg-pokemon-short`)}
        size="small"
        withBackButton
        previousUrl={`/app/tcg/${tcgBrand}/${tcgLang}`}
      />

      <CollectionHeader
        nbOfItems={collectionItems.length}
        collectionValue={collectionValue}
      />

      <CollectionList
        key={`${sortBy}-${sortOrder}`}
        initialItems={collectionItems}
        tcgLang={tcgLang}
        tcgBrand={tcgBrand}
        userId={userId}
        setId={setId}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
}

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
    keywords: t("keywords"),
    openGraph: {
      title: t("openGraph.title"),
      description: t("openGraph.description"),
      siteName: t("openGraph.siteName"),
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      creator: "@tcgpullsxyz",
    },
  };
}
