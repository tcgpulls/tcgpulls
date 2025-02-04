"use client";

import { useState } from "react";
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
import { usePokemonCollection } from "@/hooks/tcg/pokemon/usePokemonCollection";
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

type AddToCollectionDialogProps = {
  cardId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function AddToCollectionDialog({
  cardId,
  isOpen,
  setIsOpen,
}: AddToCollectionDialogProps) {
  const t = useTranslations();
  // Default condition is "Near Mint" to match Keystone's default
  const [formData, setFormData] = useState({
    quantity: 1,
    price: "0.00",
    acquiredAt: new Date(),
    condition: CollectionCardCondition.NM,
    gradingCompany: "",
    gradingRating: "",
    notes: "",
  });

  const { addToCollection, loading, refetch } = usePokemonCollection(cardId);

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
      const additionalFields: {
        quantity: number;
        price: string;
        acquiredAt: string;
        notes: string;
        condition: string;
        gradingCompany?: string;
        gradingRating?: string;
      } = {
        quantity: formData.quantity,
        price: formData.price,
        acquiredAt: formData.acquiredAt.toISOString(), // convert to ISO string
        notes: formData.notes,
        condition: formData.condition,
      };

      // Only add grading fields if condition is "graded"
      if (formData.condition === CollectionCardCondition.GRADED) {
        additionalFields.gradingCompany = formData.gradingCompany;
        additionalFields.gradingRating = formData.gradingRating;
      }

      await toast.promise(addToCollection(additionalFields), {
        loading: "Adding card to collection...",
        success: "Card added successfully!",
        error: "Failed to add card to collection.",
      });
      await refetch();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding card to collection", error);
      toast.error("An error occurred while adding the card.");
    }
  }

  // Whether the user can edit the grading fields
  const isGraded = formData.condition === CollectionCardCondition.GRADED;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40" />
      )}
      <Dialog open={isOpen} onClose={setIsOpen} size={`xl`} className={`z-50`}>
        <DialogTitle>{t("tcg.collection.add-form-title")}</DialogTitle>
        <DialogDescription>
          {t("tcg.collection.add-form-description")}
        </DialogDescription>
        <DialogBody className={`space-y-6`}>
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

          <Field className={`flex flex-col`}>
            <Label>{t("tcg.acquired-date-label")}</Label>
            <DatePicker
              name={"acquiredAt"}
              selected={formData.acquiredAt}
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData({ ...formData, acquiredAt: date });
                }
              }}
              dateFormat="yyyy-MM-dd"
              className={`block mt-2`}
            />
          </Field>

          <div className={`grid grid-cols-3  items-center gap-4`}>
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

            {/* Grading Company (always visible, but disabled if not GRADED) */}
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
                <option value="">Select Company</option>
                {GRADING_COMPANY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`tcg.grading.companies-list.${option.label}`)}
                  </option>
                ))}
              </Select>
            </Field>

            {/* Grading Rating (always visible, but disabled if not GRADED or no company selected) */}
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
                <option value="">Select Rating</option>
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
              <span className={`text-xs  text-primary-400`}>
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

        <DialogActions>
          {/* Plain style for Cancel */}
          <Button plain onClick={() => setIsOpen(false)}>
            {t("common.cancel")}
          </Button>
          {/* Default (accent) style for Add Card */}
          <Button onClick={handleSubmit} disabled={loading}>
            {t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
