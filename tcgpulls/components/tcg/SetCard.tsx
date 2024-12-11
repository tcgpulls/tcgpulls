import Card from "@/components/misc/Card";
import { PokemonSet } from "@prisma/client";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";

type Props = {
  set: PokemonSet;
  href: Href;
};

const SetCard = ({ set, href }: Props) => {
  return (
    <Link href={href}>
      <Card isClickable={true}>
        <img
          src={set.logo ? set.logo : "https://placehold.co/300x200"}
          className="w-full h-40 object-contain mb-4"
          alt={`${set.name} logo - ${set.originalId}`}
        />
        <h2 className="font-semibold text-sm text-center text-white">
          {set.name}
        </h2>
      </Card>
    </Link>
  );
};

export default SetCard;
