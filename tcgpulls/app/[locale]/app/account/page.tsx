import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import PageHeader from "@/components/misc/PageHeader";
import { auth } from "@/auth";

const AccountPage = async () => {
  const session = await auth();
  const t = await getTranslations();

  const sessionText = JSON.stringify(session);

  return (
    <>
      <PageHeader title={t("account-page.title")} />
      <p>{sessionText}</p>
    </>
  );
};

export default AccountPage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "account-page.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}
