import { redirect } from "next/navigation";
import { ParamsT } from "@/types/Params";

type Props = {
  params: ParamsT;
};

const TcgPage = async ({ params }: Props) => {
  // non visitable page
  // Access the locale from params
  const { locale } = await params;

  // Redirect to `/[locale]/app`
  redirect(`/${locale}/app`);
};

export default TcgPage;
