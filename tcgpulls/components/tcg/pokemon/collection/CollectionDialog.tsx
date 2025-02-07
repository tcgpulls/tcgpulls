"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/catalyst-ui/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst-ui/dialog";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Select } from "@/components/catalyst-ui/select";

import {
  CollectionCardCondition,
  GradingCompany,
  GradingRating,
} from "@/types/Collection";
import {
  AdditionalCollectionFields,
  usePokemonCollection,
} from "@/hooks/tcg/pokemon/usePokemonCollection";
import {
  CONDITION_OPTIONS,
  GRADING_COMPANY_OPTIONS,
  GRADING_RATING_OPTIONS,
  VALID_RATINGS_BY_GRADING_COMPANY,
} from "@/constants/collection";
import { useTranslations } from "use-intl";
import { Input } from "@/components/catalyst-ui/input";
import DatePicker from "@/components/catalyst-ui/datepicker";
import { Textarea } from "@/components/catalyst-ui/textarea";
import toast from "react-hot-toast";
import CollectionRemoveDialog from "@/components/tcg/pokemon/collection/CollectionRemoveDialog";
import { PokemonCollectionItem } from "@/graphql/generated";
import { useRouter } from "next/navigation";

type CollectionDialogProps = {
  cardId: string;
  /** If editing an existing collection item, pass that item’s ID. */
  itemId?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editMode?: boolean;
  /** If editing, pass in the current data for this item. */
  initialData?: AdditionalCollectionFields;
};

export default function CollectionDialog({
  cardId,
  itemId,
  isOpen,
  setIsOpen,
  editMode = false,
  initialData,
}: CollectionDialogProps) {
  const t = useTranslations();
  const { addToCollection, updateCollection, loading } =
    usePokemonCollection(cardId);
  const router = useRouter();

  // -- State for removing
  const [removeItem, setRemoveItem] = useState<PokemonCollectionItem | null>(
    null,
  );
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  // Default formData state
  const [formData, setFormData] = useState({
    quantity: 1,
    price: "0.00",
    acquiredAt: new Date(),
    condition: CollectionCardCondition.NM,
    gradingCompany: "",
    gradingRating: "",
    notes: "",
  });

  // Populate form fields if editMode is on & we have initialData
  useEffect(() => {
    if (editMode && initialData) {
      setFormData((prev) => ({
        ...prev,
        quantity: initialData.quantity ?? 1,
        price: initialData.price ?? "0.00",
        acquiredAt: initialData.acquiredAt
          ? new Date(initialData.acquiredAt)
          : new Date(),
        condition:
          (initialData.condition as CollectionCardCondition) ??
          CollectionCardCondition.NM,
        gradingCompany: initialData.gradingCompany ?? "",
        gradingRating: initialData.gradingRating ?? "",
        notes: initialData.notes ?? "",
      }));
    }
  }, [editMode, initialData]);

  // Filter which grading ratings appear based on the grading company selected
  const availableGradingRatings = formData.gradingCompany
    ? GRADING_RATING_OPTIONS.filter((option) =>
        VALID_RATINGS_BY_GRADING_COMPANY[
          formData.gradingCompany as GradingCompany
        ]?.includes(option.value as GradingRating),
      )
    : [];

  async function handleSubmit() {
    try {
      const additionalFields: AdditionalCollectionFields = {
        quantity: formData.quantity,
        price: formData.price,
        acquiredAt: formData.acquiredAt.toISOString(),
        notes: formData.notes,
        condition: formData.condition,
      };

      // If GRADED, set the grading fields
      if (formData.condition === CollectionCardCondition.GRADED) {
        additionalFields.gradingCompany = formData.gradingCompany;
        additionalFields.gradingRating = formData.gradingRating;
      }

      if (editMode && itemId) {
        // === EDIT / UPDATE path ===
        await toast.promise(updateCollection(itemId, additionalFields), {
          loading: t("tcg.collection.updating"),
          success: t("tcg.collection.update-success"),
          error: t("tcg.collection.update-error"),
        });
      } else {
        // === ADD path ===
        await toast.promise(addToCollection(additionalFields), {
          loading: t("tcg.collection.adding"),
          success: t("tcg.collection.add-success"),
          error: t("tcg.collection.add-error"),
        });
      }
      setIsOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Error adding/updating card in collection", error);
    }
  }

  const handleRemove = () => {
    setRemoveItem({ id: itemId!, card: { id: cardId } });
    setIsOpen(false);
    setIsRemoveDialogOpen(true);
  };

  // Whether the user can edit the grading fields
  const isGraded = formData.condition === CollectionCardCondition.GRADED;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40" />
      )}

      {/* Remove dialog */}
      <CollectionRemoveDialog
        cardId={removeItem?.card?.id || ""}
        itemId={removeItem?.id || ""}
        cardName={removeItem?.card?.name || ""}
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
      />

      <Dialog open={isOpen} onClose={setIsOpen} size="xl" className="z-50">
        <DialogTitle>
          {editMode
            ? t("tcg.collection.edit-form-title")
            : t("tcg.collection.add-form-title")}
        </DialogTitle>
        <DialogDescription>
          {editMode
            ? t("tcg.collection.edit-form-description")
            : t("tcg.collection.add-form-description")}
        </DialogDescription>
        <DialogBody className="space-y-6">
          <Field>
            <Label>{t("tcg.quantity-label")}</Label>
            <Input
              required
              type="number"
              name="quantity"
              min={1}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity:
                    Number(e.target.value) < 1 ? 1 : Number(e.target.value),
                })
              }
            />
          </Field>

          {/* Price Field */}
          <Field>
            <Label>{t("tcg.price-label")}</Label>
            <Input
              required
              type="number"
              name="price"
              min={0}
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </Field>

          <Field className="flex flex-col">
            <Label>{t("tcg.acquired-date-label")}</Label>
            <DatePicker
              name="acquiredAt"
              selected={formData.acquiredAt}
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData({ ...formData, acquiredAt: date });
                }
              }}
              dateFormat="yyyy-MM-dd"
              className="block mt-2"
            />
          </Field>

          <div className="grid grid-cols-3 items-center gap-4">
            {/* Condition */}
            <Field>
              <Label>{t("tcg.grading.condition-label")}</Label>
              <Select
                name="condition"
                value={formData.condition}
                onChange={(e) => {
                  const newCondition = e.target
                    .value as CollectionCardCondition;
                  setFormData({
                    ...formData,
                    condition: newCondition,
                    gradingCompany:
                      newCondition === CollectionCardCondition.GRADED
                        ? formData.gradingCompany
                        : "",
                    gradingRating:
                      newCondition === CollectionCardCondition.GRADED
                        ? formData.gradingRating
                        : "",
                  });
                }}
              >
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`tcg.grading.conditions-list.${option.label}`)}
                  </option>
                ))}
              </Select>
            </Field>

            {/* Grading Company (disabled if not GRADED) */}
            <Field>
              <Label>{t("tcg.grading.companies-label")}</Label>
              <Select
                name="gradingCompany"
                disabled={!isGraded}
                value={formData.gradingCompany}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gradingCompany: e.target.value,
                    gradingRating: "",
                  })
                }
              >
                <option value="">
                  {t("tcg.grading.companies-placeholder")}
                </option>
                {GRADING_COMPANY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`tcg.grading.companies-list.${option.label}`)}
                  </option>
                ))}
              </Select>
            </Field>

            {/* Grading Rating (disabled if not GRADED or no company) */}
            <Field>
              <Label>{t("tcg.grading.ratings-label")}</Label>
              <Select
                name="gradingRating"
                disabled={!isGraded || !formData.gradingCompany}
                value={formData.gradingRating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gradingRating: e.target.value,
                  })
                }
              >
                <option value="">{t("tcg.grading.ratings-placeholder")}</option>
                {availableGradingRatings.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`tcg.grading.ratings-list.${option.label}`)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field>
            <Label>
              {t("tcg.notes-label")}{" "}
              <span className="text-xs text-primary-400">
                ({t("common.optional")})
              </span>
            </Label>
            <Textarea
              name="notes"
              value={formData.notes}
              placeholder={t("tcg.notes-placeholder")}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </Field>
        </DialogBody>

        <DialogActions className={`flex justify-between`}>
          <div>
            {editMode && (
              <div
                onClick={handleRemove}
                className={`flex items-center justify-center rounded-lg py-1.5 px-2 text-sm text-red-500 cursor-pointer hover:underline`}
              >
                {t("common.remove")}
              </div>
            )}
          </div>
          <div>
            {/* Plain style for Cancel */}
            <Button plain onClick={() => setIsOpen(false)}>
              {t("common.cancel")}
            </Button>
            {/* Default (accent) style for Add / Save */}
            <Button onClick={handleSubmit} disabled={loading}>
              {editMode ? t("common.save") : t("common.add")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
