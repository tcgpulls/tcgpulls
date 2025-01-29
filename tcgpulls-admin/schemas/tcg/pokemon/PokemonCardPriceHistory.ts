import { json, relationship, text, timestamp } from "@keystone-6/core/fields";
import { list } from "@keystone-6/core";
import rules from "../../../accessControl";

const PokemonCardPriceHistory = list({
  ui: {
    label: "Pokemon Card Prices",
  },
  access: {
    operation: {
      query: () => true, // Public read access
      create: ({ session, context }) =>
        rules.isSudo({ context }) || rules.isAdmin({ session }),
      update: ({ session, context }) =>
        rules.isSudo({ context }) || rules.isAdmin({ session }),
      delete: ({ session, context }) =>
        rules.isSudo({ context }) || rules.isAdmin({ session }),
    },
  },
  fields: {
    card: relationship({ ref: "PokemonCard.priceHistories", many: false }),
    variant: text({ validation: { isRequired: true } }),
    tcgplayerData: json(),
    cardmarketData: json(),
    fetchedAt: timestamp({ defaultValue: { kind: "now" } }),
    priceDate: timestamp({ defaultValue: { kind: "now" } }),
    createdAt: timestamp({ defaultValue: { kind: "now" } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});

export default PokemonCardPriceHistory;
