import { ReactNode } from "react";
import PageHeader from "@/components/misc/PageHeader";
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
  const { tcgType } = await params;
  const t = await getTranslations();

  return (
    <>
      <div className={`mb-4`}>
        <PageHeader
          title={t(`common.tcg-${tcgType}-short`)}
          icon={<RectangleStackIcon />}
        />
      </div>
      <div>{children}</div>
    </>
  );
};

export default TcgTypeLayout;
