import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";
import { getTranslations } from "next-intl/server";
import { ParamsT } from "@/types/Params";

const TCGPage = async () => {
  const t = await getTranslations();

  return (
    <>
      <Link href={`/tcg/pokemon/`}>
        <Card isClickable={true}>
          <p>{t("common.tcg_pokemon")}</p>
        </Card>
      </Link>
    </>
  );
};

export default TCGPage;

export async function generateMetadata({
  params,
}: {
  params: ParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tcg_page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
