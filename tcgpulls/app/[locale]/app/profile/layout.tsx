import { ReactNode } from "react";
import { requireAuthOrRedirect } from "@/auth/requireAuthOrRedirect";
import { UrlParamsT } from "@/types/Params";

type Props = {
  children: ReactNode;
  params: UrlParamsT;
};

const AccountLayout = async ({ children, params }: Props) => {
  const { locale } = await params;
  await requireAuthOrRedirect({ redirectRoute: `/${locale}/app/profile` });

  return <div>{children}</div>;
};

export default AccountLayout;
