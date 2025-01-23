import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AccountLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default AccountLayout;
