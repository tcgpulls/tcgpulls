import { ReactNode } from "react";

const SetsLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default SetsLayout;
