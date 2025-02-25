import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import ListHeader from "@/components/tcg/pokemon/misc/ListHeader";
import { getTranslations } from "next-intl/server";
import { LuCalendarDays } from "react-icons/lu";
import { Badge } from "@/components/catalyst-ui/badge";

const BrandHeader = async ({}) => {
  const t = await getTranslations();

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
        <div className={`flex items-start gap-2`}>
          <Badge>
            <LuCalendarDays />
            1999
          </Badge>
        </div>
      }
    />
  );
};

export default BrandHeader;
