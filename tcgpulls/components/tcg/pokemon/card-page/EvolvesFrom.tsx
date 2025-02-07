import { PokemonCard } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";

type Props = {
  evolvesFrom: PokemonCard["evolvesFrom"];
};

const EvolvesFrom = async ({ evolvesFrom }: Props) => {
  const t = await getTranslations("tcg.pokemon");

  return (
    <section>
      <h3 className="flex gap-1 text-sm text-primary-200 mb-1">
        <span className={`font-bold`}>{t("evolves-from")}:</span>
        <span>{evolvesFrom}</span>
      </h3>
    </section>
  );
};

export default EvolvesFrom;
