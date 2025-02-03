import AbilityBadge from "@/components/tcg/pokemon/misc/AbilityBadge";
import { PokemonCardAbility } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";

type Props = {
  abilities: PokemonCardAbility[];
};

const AbilitiesList = async ({ abilities }: Props) => {
  const t = await getTranslations("tcg.pokemon");

  return (
    <section>
      <h3 className="font-semibold mb-2">{t("abilities")}</h3>
      <div className="space-y-2">
        {abilities.map((ability) => (
          <div
            key={ability.id}
            className="p-4 bg-primary-800 rounded-xl space-y-2"
          >
            <div className={`flex gap-4 items-center`}>
              {ability.type && <AbilityBadge type={ability.type} />}
              <h4 className="font-bold text-sm grow">{ability.name}</h4>
            </div>
            <p className={`text-sm text-primary-400`}>{ability.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AbilitiesList;
