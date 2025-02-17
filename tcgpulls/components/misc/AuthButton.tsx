"use client";

import { Button } from "@/components/catalyst-ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "use-intl";
import Spinner from "@/components/misc/Spinner";

const AuthButton = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("common");

  if (status === "loading") {
    return (
      <Button className={`w-20`}>
        <Spinner color={`#fff`} size={12} />
      </Button>
    );
  }

  return (
    <div>
      {session?.user ? (
        <Button color={`primary`} onClick={() => signOut()}>
          {t("auth.sign-out")}
        </Button>
      ) : (
        <Button color={`primary`} onClick={() => signIn()}>
          {t("auth.sign-in")}
        </Button>
      )}
    </div>
  );
};

export default AuthButton;
