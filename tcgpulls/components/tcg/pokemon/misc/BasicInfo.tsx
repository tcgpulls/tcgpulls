import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { PokemonEnergyT } from "@/types/Pokemon";
import { TcgLangT } from "@/types/Tcg";
import { PokemonCard } from "@/graphql/generated";
import camelCaseToWords from "@/utils/camelCaseToWords";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { Badge } from "@/components/catalyst-ui/badge";
import { HiHeart, HiStar } from "react-icons/hi2";
import { HiHashtag } from "react-icons/hi";
import { getTranslations } from "next-intl/server";
import CardPageAddToCollection from "@/components/tcg/pokemon/misc/CardPageAddToCollection";

type Props = {
  card: PokemonCard;
  tcgLang: TcgLangT;
};

const BasicInfo = async ({ card, tcgLang }: Props) => {
  const { id, name, variant, set, rarity, hp, types } = card;
  const t = await getTranslations();

  return (
    <section>
      <p className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <Image
          width={120}
          height={46}
          src={assetsUrl(
            `img/tcg/pokemon/sets/${tcgLang}/${set?.tcgSetId}/logo.png`,
          )}
          alt={`${set?.name} - ${set?.series}`}
        />
        <span>
          {set?.name} - {set?.series}
        </span>
      </p>
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-2">
        {types &&
          types.length > 0 &&
          types.map((type: PokemonEnergyT) => (
            <EnergyIcon type={type} key={type} />
          ))}
        <span>
          {name}
          {variant && (
            <span className={`text-sm font-normal`}>
              {" "}
              - {camelCaseToWords(variant)}{" "}
            </span>
          )}
        </span>
      </h1>
      <div className={`inline-flex flex-col gap-2`}>
        <div className="flex flex-wrap gap-2">
          <Badge title={`# ${card.number}`} color={`primary`}>
            <HiHashtag />
            {card.number}
          </Badge>
          {rarity && (
            <Badge title={`${t("common.rarity")}: ${rarity}`} color={`primary`}>
              <HiStar />
              {rarity}
            </Badge>
          )}
          {hp && (
            <Badge title={`${t("tcg.pokemon.hp")}: ${hp}`} color={`primary`}>
              <HiHeart /> {hp}
            </Badge>
          )}
          <CardPageAddToCollection cardId={id} />
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
