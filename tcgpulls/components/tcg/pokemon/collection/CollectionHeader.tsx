import { getTranslations } from "next-intl/server";
import ListHeader from "@/components/tcg/pokemon/misc/ListHeader";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Badge } from "@/components/catalyst-ui/badge";
import { TbCards } from "react-icons/tb";

type Props = {
  nbOfItems: number;
  collectionValue: number;
};

const CollectionHeader = async ({ nbOfItems, collectionValue }: Props) => {
  const t = await getTranslations();

  return (
    <ListHeader
      title={t("common.collection")}
      leftEl={<MdOutlineCollectionsBookmark size={96} />}
      rightEl={
        <div className={`flex items-start gap-2`}>
          <Badge>
            <TbCards />
            {nbOfItems} {t("common.collected")}
          </Badge>
          <Badge>
            <span className={`font-semibold transform scale-x-110`}>$</span>
            {collectionValue.toLocaleString()}
          </Badge>
        </div>
      }
    />
  );
};

export default CollectionHeader;
