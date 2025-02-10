import Card from "@/components/misc/Card";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import camelCaseToWords from "@/utils/camelCaseToWords";
import { GetPokemonCardsQuery } from "@/graphql/generated";
import { Badge } from "@/components/catalyst-ui/badge";
import { HiHashtag } from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import { HiStar } from "react-icons/hi2";
import { Divider } from "@/components/catalyst-ui/divider";
import CardHeader from "@/components/misc/CardHeader";
import CardFooter from "@/components/misc/CardFooter";
import SmallCardImage from "@/components/tcg/pokemon/card-page/SmallCardImage";

type PokemonCardItem = NonNullable<GetPokemonCardsQuery["pokemonCards"]>[0];

type Props = {
  card: PokemonCardItem;
  href: Href;
};

const CardCard = ({ card, href }: Props) => {
  return (
    <Link href={href}>
      <Card
        isClickable={true}
        className="flex flex-col items-stretch h-full space-y-4"
      >
        {/* Image */}
        <SmallCardImage card={card} />

        <Divider />

        <CardHeader
          title={card.name!}
          subtitle={`${card.set?.name} - ${card.set?.series}`}
        >
          {card.number && (
            <div className={`w-full flex items-start justify-end gap-2`}>
              <Badge>
                <HiHashtag />
                {card.number}
              </Badge>
            </div>
          )}
        </CardHeader>

        {/* Extra Details */}
        <CardFooter>
          {card.variant && card.variant !== "Normal" && (
            <Badge color="primary">
              <BsStars />
              {camelCaseToWords(card.variant)}
            </Badge>
          )}
          {card.rarity && (
            <Badge color="primary">
              <HiStar />
              {camelCaseToWords(card.rarity)}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardCard;
