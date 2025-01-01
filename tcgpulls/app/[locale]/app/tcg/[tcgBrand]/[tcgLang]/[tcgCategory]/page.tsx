import { getSets } from "@/actions/getSets";
import SetsList from "@/components/tcg/SetsList";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { Heading } from "@/components/catalyst-ui/heading";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface Props {
  params: UrlParamsT;
}

const PAGE_SIZE = 24;

const TcgTypeSetsPage = async ({ params }: Props) => {
  const { tcgLang, tcgBrand, tcgCategory } = await params;
  const t = await getTranslations();
  const sortBy = "releaseDate";
  const sortOrder = "desc";

  if (!tcgBrand || !tcgCategory || !tcgLang) {
    // Handle the case where tcgBrand is undefined
    notFound();
  }

  const initialSets = await getSets({
    tcgLang,
    tcgBrand,
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
