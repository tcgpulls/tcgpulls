import Card from "@/components/misc/Card";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import Image from "next/image";
import { GetPokemonSetsQuery } from "@/graphql/generated";
import { assetsUrl } from "@/utils/assetsUrl";

type PokemonSetItem = NonNullable<GetPokemonSetsQuery["pokemonSets"]>[0];

type Props = {
  set: PokemonSetItem;
  href: Href;
};

const SetCard = ({ set, href }: Props) => {
  return (
    <Link href={href}>
      <Card isClickable={true} className={`p-4`}>
        <Image
          src={
            set.logoStorageUrl
              ? assetsUrl(set.logoStorageUrl)
              : set.logoApiUrl
                ? set.logoApiUrl
                : "https://placehold.co/300x200"
          }
          className="w-full h-40 object-contain mb-4"
          alt={`${set.name} logo - ${set.tcgSetId}`}
          width={300}
          height={200}
        />
        <div className={`flex flex-col items-center gap-1`}>
          <h2 className="font-semibold text-sm text-center text-white">
            {set.name}
          </h2>
          <p className={`text-xs`}>({set.tcgSetId})</p>
        </div>
      </Card>
    </Link>
  );
};

export default SetCard;
