import { ReactNode } from "react";
import { UrlParamsT } from "@/types/Params";
// import TcgLanguageSwitcher from "@/components/navigation/TcgLanguageSwitcher";

const TcgTypeLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: UrlParamsT;
}>) => {
  const { tcgLang, tcgBrand, tcgCategory } = await params;

  if (!tcgLang || !tcgBrand || !tcgCategory) {
    return null;
  }

  return (
    <>
      {/*<div className={`pt-8 pb-8`}>*/}
      {/*  <TcgLanguageSwitcher*/}
      {/*    tcgLang={tcgLang}*/}
      {/*    tcgBrand={tcgBrand}*/}
      {/*    tcgCategory={tcgCategory}*/}
      {/*  />*/}
      {/*</div>*/}
      <div>{children}</div>
    </>
  );
};

export default TcgTypeLayout;
