import PageHeader from "@/components/misc/PageHeader";
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";
import { ParamsT } from "@/types/Params";

interface Props {
  params: ParamsT;
  searchParams: Promise<{ page?: string }>;
}

const PokemonTCGPage = async ({}: Props) => {
  const t = await getTranslations();

  // const response = await axiosInstance(`/api/public/tcg/${tcgType}/sets`, {
  //   params: {
  //     tcg_language: "en",
  //     limit: PAGE_SIZE,
  //     offset,
  //   },
  // });
  //
  // const { data: sets, total } = response.data;
  //
  // const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title={t("common.tcg_pokemon")}
        icon={<RectangleStackIcon />}
      />
      {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">*/}
      {/*  {sets.map((set: PokemonSet) => (*/}
      {/*    <SetCard*/}
      {/*      key={set.id}*/}
      {/*      set={set}*/}
      {/*      href={`/app/tcg/pokemon/sets/${set.originalId}`}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}
      {/*<PaginationComponent currentPage={currentPage} totalPages={totalPages} />*/}
    </>
  );
};

export default PokemonTCGPage;
