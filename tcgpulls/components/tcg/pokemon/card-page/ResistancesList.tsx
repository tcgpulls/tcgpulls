import { getTranslations } from "next-intl/server";
import { PokemonCard } from "@/graphql/generated";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { PokemonEnergyT } from "@/types/Pokemon";

type Props = {
  resistances: PokemonCard["resistances"];
};

const ResistancesList = async ({ resistances }: Props) => {
  const t = await getTranslations("tcg.pokemon");

  return (
    <section>
      <h3 className="font-semibold mb-2">{t("resistances")}</h3>
      <div className="bg-primary-800 rounded-xl p-4 font-smibold">
        {resistances && resistances.length > 0 ? (
          resistances.map((resistance) => (
            <p key={resistance.id} className={`flex items-center gap-2`}>
              <EnergyIcon type={resistance.type! as PokemonEnergyT} />
              <span>{resistance.value}</span>
            </p>
          ))
        ) : (
          <p>-</p>
        )}
      </div>
    </section>
  );
};

export default ResistancesList;
