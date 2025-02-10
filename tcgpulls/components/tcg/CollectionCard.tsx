import Card from "@/components/misc/Card";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import Image from "next/image";
import camelCaseToWords from "@/utils/camelCaseToWords";
import { PokemonCollectionItem } from "@/graphql/generated";
import { assetsUrl } from "@/utils/assetsUrl";
import { PokemonCardVariantT } from "@/types/Pokemon";
import { useTranslations } from "use-intl";
import { Badge } from "@/components/catalyst-ui/badge";
import { HiHashtag } from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import { HiStar } from "react-icons/hi2";
import { formatDateShort } from "@/utils/formatDate";
import { LuCalendarArrowDown } from "react-icons/lu";
import PriceFormatter from "@/components/misc/PriceFormatter";
import { TbCardsFilled } from "react-icons/tb";
import { Divider } from "@/components/catalyst-ui/divider";
import CardHeader from "@/components/misc/CardHeader";
import CardFooter from "@/components/misc/CardFooter";

type Props = {
  item: PokemonCollectionItem;
  href: Href;
};

// Temporary until we have a proper way to handle this
const TEMPORARY_PREV_PRICE = 100;

const CollectionCard = ({ item, href }: Props) => {
  const t = useTranslations();

  const { card, quantity, price, acquiredAt } = item;

  if (!card) {
    return null;
  }

  const formattedAcquiredAt = formatDateShort(new Date(acquiredAt));

  return (
    <Link href={href}>
      <Card className={`h-full space-y-4`} isClickable={true}>
        <div className={`relative`}>
          <Image
            src={
              card.imageLargeStorageUrl
                ? assetsUrl(card.imageLargeStorageUrl)
                : card.imageLargeApiUrl
                  ? card.imageLargeApiUrl
                  : assetsUrl("img/tcg/pokemon/card-placeholder.jpg")
            }
            className="w-full object-contain rounded-card"
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
          <Badge>
            <PriceFormatter
              price={price}
              priceActionCondition={price < TEMPORARY_PREV_PRICE}
            />
          </Badge>
        </CardHeader>

        <CardFooter>
          <Badge>
            <LuCalendarArrowDown />
            {formattedAcquiredAt}
          </Badge>
          <Badge
            className={`font-semibold whitespace-nowrap`}
            color={`primary`}
          >
            <TbCardsFilled />
            {quantity}{" "}
            {t(`common.${quantity! > 1 ? "cards" : "card"}`).toLowerCase()}
          </Badge>
          <Badge color={`primary`}>
            <HiHashtag />
            {card.number}
          </Badge>
          {card.variant !== PokemonCardVariantT.Normal ? (
            <Badge color={`primary`}>
              <BsStars />
              {camelCaseToWords(card.variant!)}
            </Badge>
          ) : null}
          {card.rarity && (
            <Badge color={`primary`}>
              <HiStar />

              {card.rarity}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CollectionCard;
