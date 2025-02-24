import Card from "@/components/misc/Card";
import { Link } from "@/components/catalyst-ui/link";
import { Href } from "@react-types/shared";
import Image from "next/image";
import { GetPokemonSetsQuery } from "@/graphql/generated";
import { assetsUrl } from "@/utils/assetsUrl";
import { useTranslations } from "use-intl";
import { Badge } from "@/components/catalyst-ui/badge";
import { LuCalendar } from "react-icons/lu";
import { Divider } from "@/components/catalyst-ui/divider";
import PtcgGoCode from "@/components/misc/PtcgGoCode";
import CardHeader from "@/components/misc/CardHeader";
import CardFooter from "@/components/misc/CardFooter";
import { formatDateShort } from "@/utils/formatDate";

type PokemonSetItem = NonNullable<GetPokemonSetsQuery["pokemonSets"]>[0];

type Props = {
  set: PokemonSetItem;
  href: Href;
};

const SetCard = ({ set, href }: Props) => {
  const t = useTranslations();

  // Fallback for logo image
  const logoUrl = set.logoStorageUrl
    ? assetsUrl(set.logoStorageUrl)
    : set.logoApiUrl
      ? set.logoApiUrl
      : "https://placehold.co/300x200";

  const symbolUrl = set.symbolStorageUrl
    ? assetsUrl(set.symbolStorageUrl)
    : set.symbolApiUrl
      ? set.symbolApiUrl
      : "https://placehold.co/40x40";

  // Format the release date (you might have a helper; otherwise, use toLocaleDateString)
  const formattedReleaseDate = formatDateShort(new Date(set.releaseDate));

  return (
    <Link href={href}>
      <Card
        isClickable={true}
        className="h-full p-4 space-y-4 flex flex-col items-start"
      >
        {/* Image */}
        <div className="flex items-center justify-center mx-auto min-h-40 px-4 py-12">
          <Image
            src={logoUrl}
            alt={`${set.name} logo - ${set.tcgSetId}`}
            width={300}
            height={128}
            className="w-52 h-24 object-contain"
          />
        </div>

        <Divider />

        <CardHeader title={set.name!} subtitle={set.series!}>
          {set.symbolStorageUrl && (
            <>
              <Image
                src={symbolUrl}
                alt={`${set.name} logo - ${set.tcgSetId}`}
                width={300}
                height={128}
                className="w-8 h-8 object-contain"
              />
            </>
          )}
        </CardHeader>

        <CardFooter>
          {set.releaseDate && (
            <Badge>
              <LuCalendar />
              {formattedReleaseDate}
            </Badge>
          )}
          {set.total !== undefined && (
            <Badge color="primary">
              <div>
                <span className={`font-semibold`}>{set.total}</span>{" "}
                {t("common.cards").toLowerCase()}
              </div>
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SetCard;
