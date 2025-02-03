import { list } from "@keystone-6/core";
import {
  text,
  select,
  timestamp,
  relationship,
  integer,
  decimal,
} from "@keystone-6/core/fields";
import rules from "../../../accessControl";
import { session } from "../../../auth";
import {
  CollectionCardCondition,
  GradingCompany,
  GradingRating,
} from "../../../types/Collection";
import { VALID_RATINGS_BY_GRADING_COMPANY } from "../../../constants/tcg/condition-grading";

export const PokemonCollectionItem = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
    filter: {
      query: ({ session, context }) => {
        if (
          rules.isSudo({ context }) ||
          rules.isSuperAdmin({ session }) ||
          rules.isAdmin({ session })
        ) {
          return true;
        }
        // Normal user => only their own collection
        return { user: { id: { equals: session?.itemId } } };
      },
      update: ({ session, context }) => {
        if (
          rules.isSudo({ context }) ||
          rules.isSuperAdmin({ session }) ||
          rules.isAdmin({ session })
        ) {
          return true;
        }
        return { user: { id: { equals: session?.itemId } } };
      },
      delete: ({ session, context }) => {
        if (
          rules.isSudo({ context }) ||
          rules.isSuperAdmin({ session }) ||
          rules.isAdmin({ session })
        ) {
          return true;
        }
        return { user: { id: { equals: session?.itemId } } };
      },
    },
  },
  ui: {
    isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    listView: {
      initialColumns: [
        "user",
        "card",
        "quantity",
        "price",
        "condition",
        "acquiredAt",
      ],
    },
  },
  fields: {
    user: relationship({
      ref: "User.collections",
      ui: {
        hideCreate: true,
      },
    }),
    card: relationship({
      ref: "PokemonCard.collections",
      ui: {
        hideCreate: true,
      },
    }),
    quantity: integer({
      defaultValue: 1,
      validation: { isRequired: true, min: 1 },
    }),
    price: decimal({
      scale: 2,
      defaultValue: "0.00",
    }),
    condition: select({
      options: [
        { label: "Graded", value: CollectionCardCondition.GRADED },
        { label: "Near Mint", value: CollectionCardCondition.NM },
        { label: "Lightly Played", value: CollectionCardCondition.LP },
        { label: "Moderately Played", value: CollectionCardCondition.MP },
        { label: "Heavily Played", value: CollectionCardCondition.HP },
        { label: "Damaged", value: CollectionCardCondition.DMG },
        { label: "Unknown", value: CollectionCardCondition.UNK },
      ],
      defaultValue: CollectionCardCondition.NM,
      ui: {
        itemView: { fieldMode: "edit" },
      },
    }),
    gradingCompany: select({
      options: [
        { label: "PSA", value: GradingCompany.PSA },
        { label: "Beckett", value: GradingCompany.BECK },
        { label: "CGC", value: GradingCompany.CGC },
      ],
    }),
    gradingRating: select({
      options: [
        { label: "10", value: GradingRating.TEN },
        { label: "9.5", value: GradingRating.NINE_HALF },
        { label: "9", value: GradingRating.NINE },
        { label: "9+", value: GradingRating.NINE_PLUS },
        { label: "8.5", value: GradingRating.EIGHT_HALF },
        { label: "8+", value: GradingRating.EIGHT_PLUS },
        { label: "8", value: GradingRating.EIGHT },
        { label: "7", value: GradingRating.SEVEN },
        { label: "6", value: GradingRating.SIX },
        { label: "5", value: GradingRating.FIVE },
        { label: "4", value: GradingRating.FOUR },
        { label: "3", value: GradingRating.THREE },
        { label: "2", value: GradingRating.TWO },
        { label: "1", value: GradingRating.ONE },
        { label: "Black Label", value: GradingRating.BLACK_LABEL },
        { label: "Other", value: GradingRating.OTHER },
      ],
    }),
    acquiredAt: timestamp({
      defaultValue: { kind: "now" },
    }),

    notes: text({
      ui: {
        displayMode: "textarea",
      },
    }),
  },

  hooks: {
    beforeOperation: async ({ resolvedData, operation }) => {
      if (
        (operation === "create" || operation === "update") &&
        resolvedData.condition === "graded" &&
        resolvedData.gradingCompany &&
        resolvedData.gradingRating
      ) {
        const allowedRatings =
          VALID_RATINGS_BY_GRADING_COMPANY[
            resolvedData.gradingCompany as GradingCompany
          ];
        if (!allowedRatings?.includes(resolvedData.gradingRating)) {
          throw new Error(
            `The rating "${resolvedData.gradingRating}" is not valid for ${resolvedData.gradingCompany}.`,
          );
        }
      }
    },
    resolveInput: async ({ operation, resolvedData, context }) => {
      if (operation === "create") {
        // Force-fetch session manually
        const userSession = await session.get({ context });

        if (!userSession?.itemId) {
          throw new Error(
            "Session missing! Keystone is not passing session automatically.",
          );
        }

        // Attach the user to the collection entry
        resolvedData.user = { connect: { id: userSession.itemId } };
      }
      return resolvedData;
    },
  },
});
