import { ReactNode } from "react";
import Header from "@/components/misc/Header";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import { RectangleStackIcon } from "@heroicons/react/20/solid";

const TcgTypeLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: UrlParamsT;
}>) => {
  const { tcgBrand } = await params;
  const t = await getTranslations();

  return (
    <>
      <Header
        title={t(`common.tcg-${tcgBrand}-short`)}
        icon={<RectangleStackIcon />}
      />
      <div className={`mt-6`}>{children}</div>
    </>
  );
};

export default TcgTypeLayout;
