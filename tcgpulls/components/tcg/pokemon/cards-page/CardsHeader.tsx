import { PokemonSetItemFragment } from "@/graphql/generated";
import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { formatDateShort } from "@/utils/formatDate";
import { Badge } from "@/components/catalyst-ui/badge";
import { GoListOrdered } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";
import { TbCards } from "react-icons/tb";
import ListHeader from "@/components/tcg/pokemon/misc/ListHeader";
import { useTranslations } from "next-intl";

type Props = {
  set: PokemonSetItemFragment;
};

const CardsHeader = ({ set }: Props) => {
  const t = useTranslations();
  if (!set) return null;

  // Format release date if available.
  const formattedReleaseDate = set.releaseDate
    ? formatDateShort(new Date(set.releaseDate))
    : "Unknown Release Date";

  const symbolUrl = set.symbolStorageUrl
    ? assetsUrl(set.symbolStorageUrl)
    : set.symbolApiUrl
      ? set.symbolApiUrl
      : "https://placehold.co/40x40";

  return (
    <ListHeader
      leftEl={
        <>
          {set.logoStorageUrl ? (
            <Image
              src={assetsUrl(set.logoStorageUrl)}
              alt={set.name || "Set Logo"}
              width={260}
              height={140}
              className="object-contain"
            />
          ) : (
            <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
              No Logo
            </div>
          )}
        </>
      }
      rightEl={
        <div className={`flex flex-col gap-4`}>
          <h1 className="flex items-end gap-4 font-bold text-primary-100">
            <span className={`text-2xl md:text-3xl`}>{set.name}</span>
            {set.symbolStorageUrl && (
              <Image
                src={symbolUrl}
                alt={`${set.name} logo - ${set.tcgSetId}`}
                width={300}
                height={128}
                className="w-8 h-6 mb-1 object-contain"
              />
            )}
          </h1>
          <div className={`flex flex-wrap items-start gap-2`}>
            {set.series && (
              <Badge>
                <GoListOrdered /> {set.series}
              </Badge>
            )}
            <Badge>
              <LuCalendarDays /> {formattedReleaseDate}
            </Badge>
            {(set.total !== null || set.printedTotal !== null) && (
              <Badge>
                <TbCards />
                <span>
                  {set.total} {t("common.cards")}
                </span>
                {}
              </Badge>
            )}
          </div>
        </div>
      }
    />
  );
};

export default CardsHeader;
