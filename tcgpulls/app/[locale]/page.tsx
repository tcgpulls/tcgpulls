import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { UrlParamsT } from "@/types/Params";
import { Button } from "@/components/catalyst-ui/button";

const HomePage = async () => {
  const t = await getTranslations("landing_page");
  return (
    <div>
      <h1>{t("title")}</h1>
      <Button href={`/app`}>Go to App</Button>
    </div>
  );
};

export default HomePage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "landing_page.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}
