import { ReactNode } from "react";

const PullsLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default PullsLayout;
