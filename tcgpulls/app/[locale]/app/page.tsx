import { Metadata } from "next";
import Card from "@/components/misc/Card";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import getTcgLanguage from "@/utils/getTcgLanguage";
import Header from "@/components/misc/Header";
import { Link } from "@/i18n/routing";

const AppPage = async () => {
  const tcgLang = await getTcgLanguage();
  const t = await getTranslations();

  return (
    <>
      <Header title={t("common.home")} />
      <Link href={`/app/tcg/pokemon/${tcgLang}`}>
        <Card isClickable={true}>
          <p>{t("common.tcg-pokemon")}</p>
        </Card>
      </Link>
    </>
  );
};

export default AppPage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app-page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
