// app/signin/page.tsx
import { redirect } from "next/navigation";
import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/catalyst-ui/button";
import { getTranslations } from "next-intl/server";
import { FcGoogle } from "react-icons/fc";
import { ReactNode } from "react";
import { SearchParamsT, UrlParamsT } from "@/types/Params";
import { Link } from "@/i18n/routing";
import Notice from "@/components/misc/Notice";
import { RedirectReasons } from "@/types/Redirect";

const icons: { [key: string]: ReactNode } = { google: <FcGoogle size={20} /> };
const getIcon = (provider: { name: string; id: string }) => {
  const { name } = provider;
  return icons[name.toLowerCase()] ?? null;
};

const removeRedirectReasonParam = (url: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete("redirectReason");
  return urlObj.toString();
};

export default async function SignInPage({
  searchParams,
}: {
  params: UrlParamsT;
  searchParams: SearchParamsT;
}) {
  const { callbackUrl } = await searchParams;
  const t = await getTranslations();

  const filteredCallbackUrl = callbackUrl
    ? removeRedirectReasonParam(callbackUrl)
    : null;

  return (
    <div className="min-h-screen flex flex-col gap-12 items-center justify-center p-4">
      {callbackUrl &&
        callbackUrl.indexOf(RedirectReasons.NotAuthenticated) > -1 && (
          <Notice
            type={`warning`}
            message={t("common.auth.not-authenticated")}
          />
        )}
      <div className="w-full max-w-md bg-primary-800 p-6 rounded-lg shadow">
        <h1 className={`text-2xl font-bold text-center`}>
          {t("common.company")}
        </h1>

        <div className="mt-6">
          <div className="space-y-2">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  "use server";
                  try {
                    await signIn(provider.id, {
                      redirectTo: filteredCallbackUrl ?? "/",
                    });
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`/app/sign-in?error=${error.type}`);
                    }
                    throw error;
                  }
                }}
              >
                <Button type="submit" outline className="w-full">
                  {getIcon(provider)} Sign in with {provider.name}
                </Button>
              </form>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Link
          className={`text-accent-500 font-semibold underline`}
          href={`/app`}
        >
          {t("common.return-to-home")}
        </Link>
      </div>
    </div>
  );
}
