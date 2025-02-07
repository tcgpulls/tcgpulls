import { PokemonCard } from "@/graphql/generated";
import { PokemonEnergyT } from "@/types/Pokemon";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { getTranslations } from "next-intl/server";

type Props = {
  retreatCost: PokemonCard["retreatCost"];
};

const RetreatCost = async ({ retreatCost }: Props) => {
  const t = await getTranslations("tcg.pokemon");
  return (
    <section>
      <h3 className="font-semibold mb-2">{t("retreat")}</h3>
      <div className="flex items-center gap-1 bg-primary-800 rounded-xl p-4">
        {retreatCost && retreatCost.length > 0 ? (
          retreatCost.map((type: PokemonCard["retreatCost"], index: number) => (
            <EnergyIcon key={index} type={type as PokemonEnergyT} />
          ))
        ) : (
          <p className={`font-semibold`}>-</p>
        )}
      </div>
    </section>
  );
};

export default RetreatCost;
