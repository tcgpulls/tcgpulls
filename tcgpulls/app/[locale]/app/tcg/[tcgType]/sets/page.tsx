import SetCard from "@/components/tcg/SetCard";
import PageHeader from "@/components/misc/PageHeader";
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import PaginationComponent from "@/components/misc/Pagination";
import { PokemonSet } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { ParamsT } from "@/types/Params";
import axiosInstance from "@/utils/axiosInstance";

const PAGE_SIZE = 36;

interface Props {
  params: ParamsT;
  searchParams: Promise<{ page?: string }>;
}

const PokemonTCGPage = async ({ params, searchParams }: Props) => {
  const { tcgType } = await params;
  const { page } = await searchParams;
  const t = await getTranslations();
  const currentPage = parseInt(page || "1", 10);
  const offset = (currentPage - 1) * PAGE_SIZE;

  // API call with axiosInstance
  const response = await axiosInstance.get(`/api/public/tcg/${tcgType}/sets`, {
    params: {
      tcg_language: "en",
      limit: PAGE_SIZE,
      offset,
    },
  });

  const { data: sets, total } = response.data;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title={t("common.tcg_pokemon")}
        icon={<RectangleStackIcon />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {sets.map((set: PokemonSet) => (
          <SetCard
            key={set.id}
            set={set}
            href={`/app/tcg/pokemon/sets/${set.originalId}`}
          />
        ))}
      </div>
      <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
    </>
  );
};

export default PokemonTCGPage;
