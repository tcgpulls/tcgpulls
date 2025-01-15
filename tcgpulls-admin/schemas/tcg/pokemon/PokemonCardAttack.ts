import { list } from "@keystone-6/core";
import rules from "../../../accessControl";
import { integer, json, relationship, text } from "@keystone-6/core/fields";

const PokemonCardAttack = list({
  ui: {
    label: "Pokemon Attacks",
    isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    cost: json(),
    convertedEnergyCost: integer({ validation: { isRequired: true } }),
    damage: text(),
    text: text(),
    card: relationship({ ref: "PokemonCard.attacks", many: false }),
  },
  access: {
    operation: {
      query: () => true,
      create: ({ session }) => rules.isAdmin({ session }),
      update: ({ session }) => rules.isAdmin({ session }),
      delete: ({ session }) => rules.isAdmin({ session }),
    },
  },
});

export default PokemonCardAttack;
