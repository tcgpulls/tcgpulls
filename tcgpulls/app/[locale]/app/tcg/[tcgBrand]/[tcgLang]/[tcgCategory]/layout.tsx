import { ReactNode } from "react";
import { UrlParamsT } from "@/types/Params";

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
      <div>{children}</div>
    </>
  );
};

export default TcgTypeLayout;
