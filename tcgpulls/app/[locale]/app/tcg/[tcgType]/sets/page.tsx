import { getSets } from "@/actions/getSets";
import PageHeader from "@/components/misc/PageHeader";
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";
import SetsList from "@/components/tcg/SetsList";
import { UrlParamsT } from "@/types/Params";

interface Props {
  params: UrlParamsT;
}

const PAGE_SIZE = 24;

const TcgTypeSetsPage = async ({ params }: Props) => {
  const { tcgType } = await params;
  const t = await getTranslations();

  if (!tcgType) {
    // Handle the case where tcgType is undefined
    return null;
  }

  const initialSets = await getSets({ tcgType, offset: 0, limit: PAGE_SIZE });

  return (
    <>
      <PageHeader
        title={`${t("common.tcg_pokemon_short")} - ${t("common.sets")}`}
        icon={<RectangleStackIcon />}
      />
      <SetsList initialSets={initialSets} tcgType={tcgType} />
    </>
  );
};

export default TcgTypeSetsPage;
