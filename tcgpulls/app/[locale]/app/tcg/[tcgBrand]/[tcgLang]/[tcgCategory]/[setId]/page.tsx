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
  const { setId, tcgLang, tcgBrand } = await params;
  const sortBy = "normalizedNumber";
  const sortOrder = "asc";

  if (!setId || !tcgBrand || !tcgLang) {
    notFound();
  }

  // Fetch the set information using the getSet action
  const set = await getSet({ tcgBrand, tcgLang, setId });

  if (!set) {
    notFound();
  }

  // Fetch the initial cards for the set
  const initialCards = await getCards({
    tcgLang,
    tcgBrand,
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
        tcgBrand={tcgBrand}
        setId={setId}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default SetCardsPage;
