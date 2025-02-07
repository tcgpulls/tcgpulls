import Card from "@/components/misc/Card";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import Image from "next/image";
import camelCaseToWords from "@/utils/camelCaseToWords";
import { GetPokemonCardsQuery } from "@/graphql/generated";
import { assetsUrl } from "@/utils/assetsUrl";

type PokemonCardItem = NonNullable<GetPokemonCardsQuery["pokemonCards"]>[0];

type Props = {
  card: PokemonCardItem;
  href: Href;
};

const CollectionCard = ({ card, href }: Props) => {
  return (
    <Link href={href}>
      <Card isClickable={true}>
        <Image
          src={
            card.imageSmallStorageUrl
              ? assetsUrl(card.imageSmallStorageUrl)
              : card.imageSmallApiUrl
                ? card.imageSmallApiUrl
                : assetsUrl("img/tcg/pokemon/card-placeholder.jpg")
          }
          className="w-full object-contain mb-4 rounded-xl"
          alt={`${card.name} card`}
          width={300}
          height={200}
        />
        <div className={`flex flex-col items-center gap-1`}>
          <h2 className="font-semibold text-sm text-center text-white">
            {card.name} - {card.number}
          </h2>
          <p className={`text-xs`}>({camelCaseToWords(card.variant!)})</p>
        </div>
      </Card>
    </Link>
  );
};

export default CollectionCard;
