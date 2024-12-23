import { redirect } from "next/navigation";
import { UrlParamsT } from "@/types/Params";

type Props = {
  params: UrlParamsT;
};

const CardsPage = async ({ params }: Props) => {
  // non visitable page
  // Access the locale from params
  const { locale, tcgType, tcgLang } = await params;

  // Redirect to `/[locale]/app`
  redirect(`/${locale}/app/tcg/${tcgType}/${tcgLang}`);
};

export default CardsPage;
