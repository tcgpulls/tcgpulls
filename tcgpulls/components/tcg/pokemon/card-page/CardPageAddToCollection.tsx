"use client";

import { useState } from "react";
import { useTranslations } from "use-intl";
import { signIn, useSession } from "next-auth/react";
import { MdAddBox } from "react-icons/md";
import { Badge } from "@/components/catalyst-ui/badge";
import CollectionDialog from "@/components/tcg/pokemon/collection/CollectionDialog";

type Props = {
  cardId: string;
};

export default function CardPageAddToCollection({ cardId }: Props) {
  const { status } = useSession();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  // If the user is not authenticated, show a simple button to prompt sign in.
  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <Badge
        onClick={() => signIn()}
        color="accent"
        className={`cursor-pointer hover:bg-primary-600`}
      >
        <MdAddBox /> {t("tcg.collection.sign-in-to-add")}
      </Badge>
    );
  }

  // When the user is authenticated, render a button that always opens the dialog.
  return (
    <>
      <Badge
        onClick={() => setIsOpen(true)}
        color="accent"
        className={`cursor-pointer border border-accent-500 hover:bg-accent-800`}
      >
        <MdAddBox /> {t("tcg.collection.add")}
      </Badge>
      <CollectionDialog cardId={cardId} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
