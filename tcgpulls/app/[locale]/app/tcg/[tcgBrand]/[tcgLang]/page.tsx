import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";
import { UrlParamsT } from "@/types/Params";
import { getTranslations } from "next-intl/server";

type Props = {
  params: UrlParamsT;
};

const TcgLangPage = async ({ params }: Props) => {
  const { tcgLang } = await params;
  const t = await getTranslations();

  return (
    <div className={`grid gap-8`}>
      <div>
        <Link href={`/app/tcg/pokemon/${tcgLang}/collection`}>
          <Card className={`h-96 p-4`} isClickable={true}>
            <h2 className={`font-bold text-3xl text-center`}>
              {t("common.collection")}
            </h2>
          </Card>
        </Link>
      </div>
      <div className={`grid grid-cols-2 gap-8`}>
        <Link href={`/app/tcg/pokemon/${tcgLang}/booster-packs`}>
          <Card className={`h-96 p-4`} isClickable={true}>
            <h2 className={`font-bold text-3xl text-center`}>
              {t("common.booster-packs")}
            </h2>
          </Card>
        </Link>
        <Link href={`/app/tcg/pokemon/${tcgLang}/sets`}>
          <Card className={`h-96 p-4`} isClickable={true}>
            <h2 className={`font-bold text-3xl text-center`}>
              {t("common.sets")}
            </h2>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default TcgLangPage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
