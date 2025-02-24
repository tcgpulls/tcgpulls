import { Metadata } from "next";
import Card from "@/components/misc/Card";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import getTcgLanguage from "@/utils/getTcgLanguage";
import Header from "@/components/misc/Header";
import { Link } from "@/i18n/routing";
import { assetsUrl } from "@/utils/assetsUrl";
import Image from "next/image";

const AppPage = async () => {
  const tcgLang = await getTcgLanguage();
  const t = await getTranslations();

  return (
    <>
      <Header title={t("common.home")} />

      <Link href={`/app/tcg/pokemon/${tcgLang}`}>
        <Card
          className={`h-80 p-4 flex items-center justify-center`}
          isClickable={true}
        >
          <div
            className={`flex flex-col items-center gap-8 font-bold text-2xl text-center`}
          >
            <div className={`flex flex-col items-stretch justify-center`}>
              <Image
                src={assetsUrl(`img/tcg/pokemon/pokemon-tcg-logo.png`)}
                alt={t("common.tcg-pokemon")}
                width={260}
                height={140}
                className="object-contain"
              />
            </div>
            <h2>{t("common.tcg-pokemon")}</h2>
          </div>
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
    keywords: t("keywords"),
    openGraph: {
      title: t("openGraph.title"),
      description: t("openGraph.description"),
      siteName: t("openGraph.siteName"),
      type: "website",
      locale: locale,
      images: [
        {
          url: "/og-image.png", // Add your OG image
          width: 1200,
          height: 630,
          alt: "tcgpulls.xyz",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      creator: "@yourtwitterhandle", // Replace with your Twitter handle
      images: ["/twitter-image.png"], // Add your Twitter image
    },
  };
}
