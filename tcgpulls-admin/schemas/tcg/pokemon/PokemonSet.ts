import rules from "../../../accessControl";
import { list } from "@keystone-6/core";
import {
  checkbox,
  integer,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";

const PokemonSet = list({
  ui: {
    label: "Pokemon Sets",
    listView: {
      initialSort: { field: "releaseDate", direction: "DESC" },
      initialColumns: [
        "tcgSetId",
        "name",
        "parentSet",
        "subsets",
        "language",
        "releaseDate",
      ],
    },
  },
  access: {
    operation: {
      query: () => true, // public can query
      create: ({ session }) => rules.isAdmin({ session }),
      update: ({ session }) => rules.isAdmin({ session }),
      delete: ({ session }) => rules.isAdmin({ session }),
    },
  },
  fields: {
    // EDITABLE
    // (no `ui.itemView.fieldMode` => defaults to "edit")
    name: text({ validation: { isRequired: true } }),
    logoStorageUrl: text(),
    symbolStorageUrl: text(),
    parentSet: relationship({
      ref: "PokemonSet.subsets",
    }),
    subsets: relationship({
      ref: "PokemonSet.parentSet",
      many: true,
    }),
    cards: relationship({
      ref: "PokemonCard.set",
      many: true,
    }),
    isBoosterPack: checkbox({ defaultValue: true }),

    // READ-ONLY
    tcgSetId: text({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    language: text({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    tcgSetId_language: text({
      validation: { isRequired: true },
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    releaseDate: timestamp({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    printedTotal: integer({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    ptcgoCode: text({
      db: { isNullable: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    series: text({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    total: integer({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    updatedAt: timestamp({
      db: { updatedAt: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    logoApiUrl: text({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    symbolApiUrl: text({
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    lastPriceFetchDate: timestamp({
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
  },
});

export default PokemonSet;
