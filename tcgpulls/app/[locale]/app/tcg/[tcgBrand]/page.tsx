"use client";

import { redirect, useParams } from "next/navigation";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";

const TcgTypePage = () => {
  // non-reachable page
  const { locale, tcgBrand } = useParams();
  const { currentTcgLanguage } = useTcgLanguage();

  // Redirect to `/[locale]/app`
  redirect(`/${locale}/app/tcg/${tcgBrand}/${currentTcgLanguage}`);
};

export default TcgTypePage;
