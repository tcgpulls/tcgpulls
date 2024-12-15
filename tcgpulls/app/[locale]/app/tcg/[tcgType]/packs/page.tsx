import { getPacks } from "@/actions/getPacks";
import PageHeader from "@/components/misc/PageHeader";
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import SetsList from "@/components/tcg/SetsList";

interface Props {
  params: UrlParamsT;
}

const PAGE_SIZE = 24;

const TcgTypePacksPage = async ({ params }: Props) => {
  const { tcgType } = await params;
  const t = await getTranslations();

  if (!tcgType) {
    // Handle the case where tcgType is undefined
    return null;
  }

  const initialPacks = await getPacks({ tcgType, offset: 0, limit: PAGE_SIZE });

  return (
    <>
      <PageHeader
        title={`${t("common.tcg_pokemon_short")} - ${t("common.packs")}`}
        icon={<RectangleStackIcon />}
      />
      <SetsList initialSets={initialPacks} tcgType={tcgType} />
    </>
  );
};

export default TcgTypePacksPage;
