import { ReactNode } from "react";

const TCGLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default TCGLayout;
