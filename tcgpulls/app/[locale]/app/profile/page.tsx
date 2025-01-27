import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import Header from "@/components/misc/Header";
import ProfileForm from "@/components/providers/ProfileForm";
import { requireAuthOrRedirect } from "@/auth/requireAuthOrRedirect";

type Props = {
  params: UrlParamsT;
};

const ProfilePage = async ({ params }: Props) => {
  const { locale } = await params;
  await requireAuthOrRedirect({ redirectRoute: `/${locale}/app/profile` });
  const t = await getTranslations("profile-page");

  return (
    <>
      <Header title={t("title")} />
      <ProfileForm />
    </>
  );
};

export default ProfilePage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "profile-page.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}
