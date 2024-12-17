import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { UrlParamsT } from "@/types/Params";
import { Button } from "@/components/catalyst-ui/button";
import { Heading } from "@/components/catalyst-ui/heading";
import Footer from "@/components/misc/Footer";
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";

const HomePage = async () => {
  const t = await getTranslations("landing_page");
  return (
    <div className={`flex flex-col justify-between min-h-screen`}>
      <main>
        <Heading>{t("title")}</Heading>
        <Button href={`/app`}>GO TO APP</Button>
        <LanguageSwitcher />
      </main>
      <div className={`p-2`}>
        <Footer />
      </div>
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
