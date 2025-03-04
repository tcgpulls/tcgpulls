"use client";

import { FC } from "react";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst-ui/dialog";
import { Button } from "@/components/catalyst-ui/button";
import { useTranslations } from "use-intl";
import { usePokemonCollection } from "@/hooks/tcg/pokemon/usePokemonCollection";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { gaEvent } from "@/lib/gtag";

/**
 * Props:
 * - cardId: the card's ID (for the hook to refetch if you like)
 * - itemId: the ID of the *particular* collection item to remove
 * - isOpen, setIsOpen: to control the dialog
 * - optionally a "cardName" or "itemLabel" to display
 */
type CollectionRemoveDialogProps = {
  cardId: string;
  itemId: string;
  cardName?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CollectionRemoveDialog: FC<CollectionRemoveDialogProps> = ({
  cardId,
  itemId,
  cardName,
  isOpen,
  setIsOpen,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { removeFromCollection, loading } = usePokemonCollection(cardId);

  async function handleRemove() {
    try {
      await toast.promise(removeFromCollection(itemId), {
        loading: t("tcg.collection.removing"),
        success: t("tcg.collection.remove-success"),
        error: t("tcg.collection.remove-error"),
      });

      gaEvent("remove_from_collection", {
        category: "collection",
        label: cardId,
        item_id: itemId,
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error removing collection item", error);
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40" />
      )}
      <Dialog open={isOpen} onClose={setIsOpen} size="md" className="z-50">
        <DialogTitle>{t("tcg.collection.remove-confirm-title")}</DialogTitle>
        <DialogDescription>
          {t("tcg.collection.remove-confirm-description", {
            cardName: cardName || "",
          })}
        </DialogDescription>

        <DialogBody>
          {/* You can place additional info or warnings here if you want */}
        </DialogBody>

        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleRemove} disabled={loading} color={`red`}>
            {t("common.remove")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CollectionRemoveDialog;
