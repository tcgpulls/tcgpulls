import Card from "@/components/misc/Card";
import { PokemonCard } from "@prisma/client";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import camelCaseToWords from "@/utils/camelCaseToWords";

type Props = {
  card: PokemonCard;
  href: Href;
};

const CardCard = ({ card, href }: Props) => {
  return (
    <Link href={href}>
      <Card isClickable={true}>
        <Image
          src={
            card.localImageSmall
              ? assetsUrl(card.localImageSmall)
              : card.imagesSmall
                ? card.imagesSmall
                : "https://placehold.co/300x200"
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
          <p className={`text-xs`}>({camelCaseToWords(card.variant)})</p>
        </div>
      </Card>
    </Link>
  );
};

export default CardCard;
