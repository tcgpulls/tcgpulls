import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";
import { UrlParamsT } from "@/types/Params";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { FaLock } from "react-icons/fa6";
import BrandHeader from "@/components/tcg/pokemon/BrandHeader";
import { TbCards } from "react-icons/tb";
import { BiGridAlt } from "react-icons/bi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";

type Props = {
  params: UrlParamsT;
};

const TcgLangPage = async ({ params }: Props) => {
  const session = await auth();
  const { tcgLang } = await params;
  const t = await getTranslations();

  const userId = session?.user?.id;

  return (
    <>
      <BrandHeader />
      <div className={`mt-8 grid gap-8`}>
        <div>
          <Link href={`/app/tcg/pokemon/${tcgLang}/booster-packs`}>
            <Card
              className={`h-48 sm:h-80 p-4 flex items-center justify-center`}
              isClickable={true}
            >
              <h2
                className={`flex flex-col items-center gap-4 font-bold text-2xl text-center`}
              >
                <TbCards size={42} />
                {t("common.booster-packs")}
              </h2>
            </Card>
          </Link>
        </div>
        <div className={`grid sm:grid-cols-2 gap-8`}>
          <Link href={`/app/tcg/pokemon/${tcgLang}/collection`}>
            <Card
              className={`h-48 sm:h-80 p-4 flex items-center justify-center`}
              isClickable={true}
            >
              <h2
                className={`flex flex-col items-center gap-4 font-bold text-2xl text-center`}
              >
                <MdOutlineCollectionsBookmark size={42} />
                <span className={`flex items-center gap-3`}>
                  {t("common.collection")}
                  {!userId && (
                    <FaLock className={`text-primary-600`} size={32} />
                  )}
                </span>
              </h2>
            </Card>
          </Link>
          <Link href={`/app/tcg/pokemon/${tcgLang}/sets`}>
            <Card
              className={`h-48 sm:h-80 p-4 flex items-center justify-center`}
              isClickable={true}
            >
              <h2
                className={`flex flex-col items-center gap-4 font-bold text-2xl text-center`}
              >
                <BiGridAlt size={42} />
                {t("common.sets")}
              </h2>
            </Card>
          </Link>
        </div>
      </div>
    </>
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
    keywords: t("keywords"),
    openGraph: {
      title: t("openGraph.title"),
      description: t("openGraph.description"),
      siteName: t("openGraph.siteName"),
      type: "website",
      locale: locale,
      // images: [
      //   {
      //     url: "/og-image.png",
      //     width: 1200,
      //     height: 630,
      //     alt: "tcgpulls.xyz",
      //   },
      // ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      creator: "@yourtwitterhandle",
      // images: ["/twitter-image.png"],
    },
  };
}
