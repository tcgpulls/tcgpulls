"use client";

import { useTranslations } from "use-intl";
import { signIn } from "next-auth/react";
import Empty from "@/components/misc/Empty";

const CollectionDetailsNotLoggedIn = () => {
  const t = useTranslations();

  return (
    <Empty
      title={t("tcg.collection.details.sign-in-message")}
      ctaText={t("common.auth.sign-in")}
      ctaOnClick={() => signIn()}
    />
  );
};

export default CollectionDetailsNotLoggedIn;
