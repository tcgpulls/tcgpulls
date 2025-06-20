import { PokemonSetItemFragment } from "@/graphql/generated";
import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { useTranslations } from "use-intl";
import { TcgCategory, TcgCategoryT } from "@/types/Tcg";
import { BiGridAlt } from "react-icons/bi";
import { TbCards } from "react-icons/tb";
import ListHeader from "@/components/tcg/pokemon/misc/ListHeader";

type Props = {
  sets: PokemonSetItemFragment[];
  tcgCategory: TcgCategoryT;
};

const SetsHeader = ({ sets, tcgCategory }: Props) => {
  const t = useTranslations();
  if (!sets) return null;

  return (
    <ListHeader
      title={t("common.tcg-pokemon")}
      leftEl={
        <Image
          src={assetsUrl(`img/tcg/pokemon/pokemon-tcg-logo.png`)}
          alt={t("common.tcg-pokemon")}
          width={260}
          height={140}
          className="object-contain"
        />
      }
      rightEl={
        <p
          className={`flex gap-2 items-center text-lg text-primary-400 font-medium`}
        >
          {tcgCategory === TcgCategory.Sets ? (
            <BiGridAlt size={20} />
          ) : (
            <TbCards size={20} />
          )}
          {t(`common.${tcgCategory}`)}
        </p>
      }
    />
  );
};

export default SetsHeader;
