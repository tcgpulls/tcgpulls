import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";
import { UrlParamsT } from "@/types/Params";
import { getTranslations } from "next-intl/server";

const SetsPage = async () => {
  const t = await getTranslations("sets_page");

  return (
    <>
      <Link href={`/app/tcg/pokemon/sets`}>
        <Card isClickable={true}>
          <p>{t("title")}</p>
        </Card>
      </Link>
    </>
  );
};

export default SetsPage;

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
