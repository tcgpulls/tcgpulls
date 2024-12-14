import { redirect } from "next/navigation";
import { UrlParamsT } from "@/types/Params";

type Props = {
  params: UrlParamsT;
};

const TcgPage = async ({ params }: Props) => {
  // non visitable page
  // Access the locale from params
  const { locale } = await params;

  // Redirect to `/[locale]/app`
  redirect(`/${locale}/app`);
};

export default TcgPage;
