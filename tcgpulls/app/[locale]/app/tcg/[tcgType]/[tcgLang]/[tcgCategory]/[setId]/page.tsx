import { getCards } from "@/actions/getCards";
import { getSet } from "@/actions/getSet";
import PageHeader from "@/components/misc/PageHeader";
import CardsList from "@/components/tcg/CardsList";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";

interface Props {
  params: UrlParamsT;
}

const PAGE_SIZE = 24;

const SetCardsPage = async ({ params }: Props) => {
  const { setId, tcgLang, tcgType } = await params;
  const sortBy = "normalizedNumber";
  const sortOrder = "asc";

  if (!setId || !tcgType || !tcgLang) {
    notFound();
  }

  // Fetch the set information using the getSet action
  const set = await getSet({ tcgType, setId });

  if (!set) {
    notFound();
  }

  // Fetch the initial cards for the set
  const initialCards = await getCards({
    tcgLang,
    tcgType,
    setIds: [setId],
    offset: 0,
    limit: PAGE_SIZE,
    sortOrder,
    sortBy,
  });

  return (
    <>
      <PageHeader title={`${set.name} (${set.setId})`} />
      <CardsList
        initialCards={initialCards}
        tcgLang={tcgLang}
        tcgType={tcgType}
        setId={setId}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default SetCardsPage;
