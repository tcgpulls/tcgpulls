import { getSets } from "@/actions/getSets";
import SetsList from "@/components/tcg/SetsList";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { Heading } from "@/components/catalyst-ui/heading";
import { getTranslations } from "next-intl/server";

interface Props {
  params: UrlParamsT;
}

const PAGE_SIZE = 24;

const TcgTypeSetsPage = async ({ params }: Props) => {
  const { tcgLang, tcgType, tcgCategory } = await params;
  const t = await getTranslations();
  const sortBy = "releaseDate";
  const sortOrder = "desc";

  if (!tcgType || !tcgCategory || !tcgLang) {
    // Handle the case where tcgType is undefined
    notFound();
  }

  const initialSets = await getSets({
    tcgLang,
    tcgType,
    tcgCategory,
    offset: 0,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  return (
    <>
      <Heading className={`pb-6`}>{t(`common.${tcgCategory}`)}</Heading>
      <SetsList
        initialSets={initialSets}
        tcgLang={tcgLang}
        tcgType={tcgType}
        tcgCategory={tcgCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default TcgTypeSetsPage;
