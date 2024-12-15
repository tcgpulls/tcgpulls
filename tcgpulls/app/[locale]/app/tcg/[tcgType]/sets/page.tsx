import SetCard from "@/components/tcg/SetCard";
import PageHeader from "@/components/misc/PageHeader";
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import PaginationComponent from "@/components/misc/Pagination";
import { PokemonSet } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { SearchParamsT, UrlParamsT } from "@/types/Params";
import axiosInstance from "@/utils/axiosInstance";
import SetGrid from "@/components/tcg/SetGrid";
import { getPagination } from "@/utils/pagination";

const PAGE_SIZE = 36;

interface Props {
  params: UrlParamsT;
  searchParams: SearchParamsT;
}

const TcgTypeSetsPage = async ({ params, searchParams }: Props) => {
  const { tcgType } = await params;
  const { page } = await searchParams;
  const t = await getTranslations();
  const { currentPage, offset } = getPagination(page, 0, PAGE_SIZE);

  const response = await axiosInstance.get(`/api/public/tcg/${tcgType}/sets`, {
    params: {
      tcg_language: "en",
      limit: PAGE_SIZE,
      offset,
    },
  });

  const { data: sets, total } = response.data;
  const { totalPages } = getPagination(page, total, PAGE_SIZE);
  return (
    <>
      <PageHeader
        title={`${t("common.tcg_pokemon_short")} - ${t("common.sets")}`}
        icon={<RectangleStackIcon />}
      />
      <SetGrid>
        {sets.map((set: PokemonSet) => (
          <SetCard
            key={set.id}
            set={set}
            href={`/app/tcg/pokemon/sets/${set.originalId}`}
          />
        ))}
      </SetGrid>
      <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
    </>
  );
};

export default TcgTypeSetsPage;
