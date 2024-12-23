"use client";

import { redirect, useParams } from "next/navigation";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";

const TcgTypePage = () => {
  // non-reachable page
  const { locale, tcgType } = useParams();
  const { currentTcgLanguage } = useTcgLanguage();

  // Redirect to `/[locale]/app`
  redirect(`/${locale}/app/tcg/${tcgType}/${currentTcgLanguage}`);
};

export default TcgTypePage;
