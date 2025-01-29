import { getTranslations } from "next-intl/server";
import { PokemonCard } from "@/graphql/generated";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { PokemonEnergyT } from "@/types/Pokemon";

type Props = {
  resistances: PokemonCard["resistances"];
};

const ResistancesList = async ({ resistances }: Props) => {
  const t = await getTranslations("tcg.pokemon");
  console.log("resistances", resistances);

  return (
    <section>
      <h3 className="text-lg font-semibold mb-2">{t("resistances")}</h3>
      <div className="bg-primary-800 rounded-xl p-4">
        {resistances && resistances.length > 0 ? (
          resistances.map((resistance) => (
            <div key={resistance.id} className={`flex items-center gap-2`}>
              <EnergyIcon type={resistance.type! as PokemonEnergyT} />
              <span>{resistance.value}</span>
            </div>
          ))
        ) : (
          <div>-</div>
        )}
      </div>
    </section>
  );
};

export default ResistancesList;
