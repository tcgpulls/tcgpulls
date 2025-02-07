import { ReactNode } from "react";
import { UrlParamsT } from "@/types/Params";

const TcgTypeLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
  params: UrlParamsT;
}>) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default TcgTypeLayout;
