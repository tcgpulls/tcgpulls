import FlavorText from "@/components/tcg/pokemon/card-page/FlavorText";
import AbilitiesList from "@/components/tcg/pokemon/card-page/AbilitiesList";
import AttacksList from "@/components/tcg/pokemon/card-page/AttacksList";
import WeaknessesList from "@/components/tcg/pokemon/card-page/WeaknessesList";
import ResistancesList from "@/components/tcg/pokemon/card-page/ResistancesList";
import RetreatCost from "@/components/tcg/pokemon/card-page/RetreatCost";
import { PokemonCard } from "@/graphql/generated";

type Props = {
  card: PokemonCard;
};

const CardDetails = ({ card }: Props) => {
  const {
    flavorText,
    abilities,
    attacks,
    weaknesses,
    resistances,
    retreatCost,
  } = card;

  return (
    <div className={`space-y-4`}>
      {flavorText && <FlavorText flavorText={flavorText} />}
      {abilities && abilities.length > 0 && (
        <AbilitiesList abilities={abilities} />
      )}
      {attacks && attacks.length > 0 && <AttacksList attacks={attacks} />}
      {((weaknesses?.length ?? 0) > 0 ||
        (resistances?.length ?? 0) > 0 ||
        (retreatCost?.length ?? 0) > 0) && (
        <div className={`grid grid-cols-3 gap-4`}>
          <WeaknessesList weaknesses={weaknesses!} />
          <ResistancesList resistances={resistances} />
          <RetreatCost retreatCost={retreatCost} />
        </div>
      )}
    </div>
  );
};

export default CardDetails;
