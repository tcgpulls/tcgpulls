import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { UrlParamsT } from "@/types/Params";
import { Button } from "@/components/catalyst-ui/button";
import { Heading } from "@/components/catalyst-ui/heading";

const HomePage = async () => {
  const t = await getTranslations("landing_page");
  return (
    <div>
      <Heading>{t("title")}</Heading>
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
