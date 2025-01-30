import rules from "../../../accessControl";
import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";

const PokemonCardAbility = list({
  ui: {
    label: "Pokemon Abilities",
    isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    text: text({ validation: { isRequired: true } }),
    type: text({ validation: { isRequired: true } }),
    card: relationship({ ref: "PokemonCard.abilities", many: false }),
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

export default PokemonCardAbility;
