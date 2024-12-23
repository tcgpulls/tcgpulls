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
  const { tcgLang, tcgType, tcgCategory } = await params;

  if (!tcgLang || !tcgType || !tcgCategory) {
    return null;
  }

  return (
    <>
      {/*<div className={`pt-8 pb-8`}>*/}
      {/*  <TcgLanguageSwitcher*/}
      {/*    tcgLang={tcgLang}*/}
      {/*    tcgType={tcgType}*/}
      {/*    tcgCategory={tcgCategory}*/}
      {/*  />*/}
      {/*</div>*/}
      <div>{children}</div>
    </>
  );
};

export default TcgTypeLayout;
