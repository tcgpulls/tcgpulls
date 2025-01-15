import { list } from "@keystone-6/core";
import {
  integer,
  json,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import rules from "../../../accessControl";

const PokemonCard = list({
  ui: {
    label: "Pokemon Cards",
    listView: {
      initialSort: {
        field: "tcgSetId",
        direction: "ASC",
      },
      initialColumns: [
        "tcgCardId_variant_language",
        "name",
        "normalizedNumber",
      ],
    },
  },
  access: {
    operation: {
      query: () => true, // Allow public access to query data
      create: ({ session }) => rules.isAdmin({ session }),
      update: ({ session }) => rules.isAdmin({ session }),
      delete: ({ session }) => rules.isAdmin({ session }),
    },
  },
  fields: {
    // ----------------------------
    // EDITABLE FIELDS
    // ----------------------------
    name: text({ validation: { isRequired: true } }),
    imageSmallStorageUrl: text(),
    imageLargeStorageUrl: text(),

    // ----------------------------
    // READ-ONLY FIELDS
    // ----------------------------
    tcgCardId: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" }, // <-- read-only when creating
      },
    }),
    tcgSetId: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    language: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    tcgCardId_variant_language: text({
      validation: { isRequired: true },
      isIndexed: "unique",
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    imageSmallApiUrl: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    imageLargeApiUrl: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    variant: text({
      defaultValue: "normal",
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    supertype: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    subtypes: json({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    hp: integer({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    types: json({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    evolvesFrom: text({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    flavorText: text({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    number: text({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    normalizedNumber: integer({
      defaultValue: 999,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    artist: text({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    rarity: text({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    nationalPokedexNumbers: json({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    retreatCost: json({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    convertedRetreatCost: integer({
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    updatedAt: timestamp({
      db: { updatedAt: true },
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),

    // Relationships (optional whether they're editable or read-only)
    abilities: relationship({ ref: "PokemonCardAbility.card", many: true }),
    attacks: relationship({ ref: "PokemonCardAttack.card", many: true }),
    weaknesses: relationship({ ref: "PokemonCardWeakness.card", many: true }),
    set: relationship({ ref: "PokemonSet.cards", many: false }),
    priceHistories: relationship({
      ref: "PokemonCardPriceHistory.card",
      many: true,
    }),
  },
});

export default PokemonCard;
