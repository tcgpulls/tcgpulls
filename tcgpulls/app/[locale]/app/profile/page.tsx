import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import Header from "@/components/misc/Header";
import { auth } from "@/auth";
import ProfileForm from "@/components/profile/ProfileForm";

const ProfilePage = async () => {
  const session = await auth();
  const t = await getTranslations("profile-page");

  return (
    <>
      <Header title={t("title")} />
      <ProfileForm
        userId={session?.user?.id || ""}
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
        image={session?.user?.image || ""}
        username={session?.user?.username || ""}
      />
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
