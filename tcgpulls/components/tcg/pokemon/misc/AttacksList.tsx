import { PokemonCardAttack } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";
import { PokemonEnergyT } from "@/types/Pokemon";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";

type Props = {
  attacks: PokemonCardAttack[];
};

const AttacksList = async ({ attacks }: Props) => {
  const t = await getTranslations("tcg.pokemon");

  return (
    <section>
      <h3 className="text-lg font-semibold mb-2">{t("attacks")}</h3>
      <div className="space-y-4">
        {attacks.map((attack) => (
          <div
            key={attack.id}
            className="p-4 bg-primary-800 rounded-xl space-y-2"
          >
            <h4 className="font-bold flex items-center justify-between gap-4">
              <span className={`flex items-center gap-1`}>
                {attack.cost &&
                  attack.cost.map((energy: PokemonEnergyT, index: number) => (
                    <EnergyIcon type={energy} key={index} />
                  ))}
              </span>
              <span className={`grow`}>{attack.name}</span>
              {attack.damage && (
                <span className="text-lg font-bold">{attack.damage}</span>
              )}
            </h4>
            {attack.text && (
              <p className="text-sm text-primary-400">{attack.text}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AttacksList;
