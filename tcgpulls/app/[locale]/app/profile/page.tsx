import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import PageNavigation from "@/components/navigation/PageNavigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { requireAuthOrRedirect } from "@/auth/requireAuthOrRedirect";
import { RedirectReasons } from "@/types/Redirect";

type Props = {
  params: UrlParamsT;
};

const ProfilePage = async ({ params }: Props) => {
  const { locale } = await params;
  const redirectReasonParam = `redirectReason=${RedirectReasons.NotAuthenticated}`;
  await requireAuthOrRedirect({
    redirectRoute: `/${locale}/app/profile?${redirectReasonParam}`,
  });
  const t = await getTranslations("profile-page");

  return (
    <>
      <PageNavigation title={t("title")} />
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
