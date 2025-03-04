import { PokemonEnergyT } from "@/types/Pokemon";
import { PokemonCard } from "@/graphql/generated";
import camelCaseToWords from "@/utils/camelCaseToWords";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { Badge } from "@/components/catalyst-ui/badge";
import { HiStar } from "react-icons/hi2";
import { getTranslations } from "next-intl/server";
import CardPageAddToCollection from "@/components/tcg/pokemon/card-page/CardPageAddToCollection";
import { BsStars } from "react-icons/bs";

type Props = {
  card: PokemonCard;
};

const BasicInfo = async ({ card }: Props) => {
  const { id, name, variant, rarity, types } = card;
  const t = await getTranslations();

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        {types &&
          types.length > 0 &&
          types.map((type: PokemonEnergyT) => (
            <EnergyIcon type={type} key={type} size={32} />
          ))}
        <h1 className={`text-3xl font-bold`}>
          {name} - #{card.number}
        </h1>
      </div>
      <div className={`inline-flex flex-col gap-2`}>
        <div className="flex flex-wrap gap-2">
          {variant && (
            <Badge
              color={`primary`}
              title={`${t("tcg.pokemon.variant")}: ${variant}`}
            >
              <BsStars />
              {camelCaseToWords(variant)}
            </Badge>
          )}
          {rarity && (
            <Badge title={`${t("common.rarity")}: ${rarity}`} color={`primary`}>
              <HiStar />
              {rarity}
            </Badge>
          )}
          <CardPageAddToCollection cardId={id} />
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
