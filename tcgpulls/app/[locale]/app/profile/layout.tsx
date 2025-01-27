import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AccountLayout = async ({ children }: Props) => {
  return <div>{children}</div>;
};

export default AccountLayout;
