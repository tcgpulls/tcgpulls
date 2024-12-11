"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SetCard from "@/components/tcg/SetCard";
import PageHeader from "@/components/misc/PageHeader";
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import PaginationComponent from "@/components/misc/Pagination";
import { PokemonSet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const PAGE_SIZE = 36;

const PokemonTCGPage = () => {
  const { language } = useLanguage(); // Get the current language from the context
  const t = useTranslations();
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchSets = async (page: number) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * PAGE_SIZE;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/tcg/pokemon/sets?language=${language}&limit=${PAGE_SIZE}&offset=${offset}`,
      );
      const { data: sets, total } = await response.json();

      setSets(sets);
      setTotalPages(Math.ceil(total / PAGE_SIZE));
    } catch (error) {
      console.error("Failed to fetch Pokémon sets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSets(currentPage);
  }, [currentPage]);

  return (
    <>
      <PageHeader
        title={t("common.tcg_pokemon")}
        icon={<RectangleStackIcon />}
      />
      {isLoading ? (
        <p>{t("common.loading")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              href={`/tcg/pokemon/sets/${set.originalId}`}
            />
          ))}
        </div>
      )}
      <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
    </>
  );
};

export default PokemonTCGPage;
