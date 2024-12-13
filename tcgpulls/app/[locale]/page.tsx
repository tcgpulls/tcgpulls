import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { ParamsT } from "@/types/Params";

const HomePage = async () => {
  const t = await getTranslations("home_page");
  return <div>{t("title")}</div>;
};

export default HomePage;

export async function generateMetadata({
  params,
}: {
  params: ParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home_page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
