import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";
import { UrlParamsT } from "@/types/Params";
import { getTranslations } from "next-intl/server";

const TcgTypePage = async () => {
  const t = await getTranslations();

  return (
    <div className={`flex flex-col gap-4`}>
      <Link href={`/app/tcg/pokemon/packs`}>
        <Card isClickable={true}>
          <p>{t("common.packs")}</p>
        </Card>
      </Link>
      <Link href={`/app/tcg/pokemon/sets`}>
        <Card isClickable={true}>
          <p>{t("common.sets")}</p>
        </Card>
      </Link>
    </div>
  );
};

export default TcgTypePage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sets_page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
