import { ReactNode } from "react";

const LanguageLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default LanguageLayout;
