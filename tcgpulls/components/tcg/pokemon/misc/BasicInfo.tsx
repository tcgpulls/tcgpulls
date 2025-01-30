import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { PokemonEnergyT } from "@/types/Pokemon";
import { TcgLangT } from "@/types/Tcg";
import { PokemonCard } from "@/graphql/generated";
import camelCaseToWords from "@/utils/camelCaseToWords";
import EnergyIcon from "@/components/tcg/pokemon/misc/EnergyIcon";
import { Badge } from "@/components/catalyst-ui/badge";

type Props = {
  card: PokemonCard;
  tcgLang: TcgLangT;
};

const BasicInfo = ({ card, tcgLang }: Props) => {
  const { name, variant, set, rarity, hp, types } = card;

  return (
    <section>
      <p className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <Image
          width={96}
          height={40}
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
      <div className="flex flex-wrap gap-2">
        <Badge color={`primary`}>#{card.number}</Badge>
        {rarity && <Badge>{rarity}</Badge>}
        {hp && <Badge>HP: {hp}</Badge>}
      </div>
    </section>
  );
};

export default BasicInfo;
