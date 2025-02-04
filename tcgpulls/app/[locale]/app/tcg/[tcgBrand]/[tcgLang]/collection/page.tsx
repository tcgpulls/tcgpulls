import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { POKEMON_CARDS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import { OrderDirection } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";
import { GET_USER_POKEMON_COLLECTION_ITEMS } from "@/graphql/tcg/pokemon/collection/queries";
import Header from "@/components/misc/Header";
import { auth } from "@/auth";
import createApolloClient from "@/lib/clients/createApolloClient";
import Spinner from "@/components/misc/Spinner";
import CollectionList from "@/components/tcg/CollectionList";

interface Props {
  params: UrlParamsT;
}

const CollectionCardsPage = async ({ params }: Props) => {
  const { locale, setId, tcgLang, tcgBrand } = await params;
  const session = await auth();

  // Validate
  if (!locale || !tcgBrand || !tcgLang) {
    notFound();
  }

  const userId = session?.user?.id;

  const client = createApolloClient(userId);

  const whereFilter = {
    user: { id: { equals: userId } },
    // only if you want to filter by set:
    card: {
      set: {
        tcgSetId: { equals: setId },
        language: { equals: tcgLang },
      },
    },
  };

  const { data, loading, error } = await client.query({
    query: GET_USER_POKEMON_COLLECTION_ITEMS,
    variables: {
      where: whereFilter,
      orderBy: [{ acquiredAt: OrderDirection.Desc }], // or "addedAt", etc.
      take: POKEMON_CARDS_PAGE_SIZE,
      skip: 0,
    },
  });

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching cards: {error.message}</p>;
  }

  const cards = data?.pokemonCollectionItems;

  if (!cards || cards.length === 0) {
    return <p>No cards found in your collection for this set.</p>;
  }

  const t = await getTranslations();

  return (
    <>
      <Header
        title={t(`common.collection`)}
        size="small"
        withBackButton
        previousUrl={`/${locale}/app/tcg/${tcgBrand}/${tcgLang}`}
      />
      <CollectionList
        key={`updatedAt-${OrderDirection.Asc}`}
        initialItems={cards}
        tcgLang={tcgLang}
        userId={userId!}
        setId={setId}
        sortBy="updatedAt"
        sortOrder={OrderDirection.Asc}
      />
    </>
  );
};

export default CollectionCardsPage;
