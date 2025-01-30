import { list } from "@keystone-6/core";
import rules from "../../../accessControl";
import { relationship, text } from "@keystone-6/core/fields";

const PokemonCardWeakness = list({
  ui: {
    label: "Pokemon Weaknesses",
    isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
  },
  fields: {
    type: text({ validation: { isRequired: true } }),
    value: text({ validation: { isRequired: true } }),
    card: relationship({ ref: "PokemonCard.weaknesses", many: false }),
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

export default PokemonCardWeakness;
