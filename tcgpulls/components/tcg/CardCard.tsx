import Card from "@/components/misc/Card";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import Image from "next/image";
import camelCaseToWords from "@/utils/camelCaseToWords";
import { GetPokemonCardsQuery } from "@/graphql/generated";
import { assetsUrl } from "@/utils/assetsUrl";
import { Badge } from "@/components/catalyst-ui/badge";
import { HiHashtag } from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import { HiStar } from "react-icons/hi2";
import { Divider } from "@/components/catalyst-ui/divider";
import CardHeader from "@/components/misc/CardHeader";
import CardFooter from "@/components/misc/CardFooter";

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
        <div className="relative">
          <Image
            src={
              card.imageLargeStorageUrl
                ? assetsUrl(card.imageLargeStorageUrl)
                : card.imageLargeApiUrl
                  ? card.imageLargeApiUrl
                  : assetsUrl("img/tcg/pokemon/card-placeholder.jpg")
            }
            className="w-full object-contain rounded-card self-end"
            alt={`${card.name} card`}
            width={300}
            height={200}
          />
        </div>

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
