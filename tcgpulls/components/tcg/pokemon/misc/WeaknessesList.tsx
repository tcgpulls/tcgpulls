import { PokemonCardWeakness } from "@/graphql/generated";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { PokemonEnergyT } from "@/types/Pokemon";
import { getTranslations } from "next-intl/server";

type Props = {
  weaknesses: PokemonCardWeakness[];
};

const WeaknessesList = async ({ weaknesses }: Props) => {
  const t = await getTranslations("tcg.pokemon");
  return (
    <section>
      <h3 className="font-semibold mb-2">{t("weaknesses")}</h3>
      <div className="bg-primary-800 rounded-xl p-4 font-semibold">
        {weaknesses && weaknesses.length > 0 ? (
          weaknesses.map((weakness) => (
            <p key={weakness.id} className={`flex items-center gap-2`}>
              <EnergyIcon type={weakness.type! as PokemonEnergyT} />
              <span>{weakness.value}</span>
            </p>
          ))
        ) : (
          <p>-</p>
        )}
      </div>
    </section>
  );
};

export default WeaknessesList;
