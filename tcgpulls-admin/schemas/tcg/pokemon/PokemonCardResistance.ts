import { list } from "@keystone-6/core";
import rules from "../../../accessControl";
import { relationship, text } from "@keystone-6/core/fields";

const PokemonCardResistance = list({
  ui: {
    label: "Pokemon Resistances",
    isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
  },
  fields: {
    type: text({ validation: { isRequired: true } }),
    value: text({ validation: { isRequired: true } }),
    card: relationship({ ref: "PokemonCard.resistances", many: false }),
  },
  access: {
    operation: {
      query: () => true,
      create: ({ session, context }) =>
        rules.isSudo({ context }) || rules.isAdmin({ session }),
      update: ({ session, context }) =>
        rules.isSudo({ context }) || rules.isAdmin({ session }),
      delete: ({ session, context }) =>
        rules.isSudo({ context }) || rules.isAdmin({ session }),
    },
  },
});

export default PokemonCardResistance;
