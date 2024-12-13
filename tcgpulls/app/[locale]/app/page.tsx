import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";
import { getTranslations } from "next-intl/server";
import { ParamsT } from "@/types/Params";

const AppPage = async () => {
  const t = await getTranslations();

  return (
    <>
      <Link href={`/app/tcg/pokemon/`}>
        <Card isClickable={true}>
          <p>{t("common.tcg_pokemon")}</p>
        </Card>
      </Link>
    </>
  );
};

export default AppPage;

export async function generateMetadata({
  params,
}: {
  params: ParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app_page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
