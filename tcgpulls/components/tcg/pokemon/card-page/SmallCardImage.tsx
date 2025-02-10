import { PokemonCard } from "@/graphql/generated";
import { assetsUrl } from "@/utils/assetsUrl";
import Image from "next/image";

type Props = {
  card: PokemonCard;
};

const SmallCardImage = ({ card }: Props) => {
  const { imageLargeStorageUrl, imageLargeApiUrl, name } = card;

  return (
    <div className="relative pt-[140%]">
      <Image
        src={
          imageLargeStorageUrl
            ? assetsUrl(imageLargeStorageUrl)
            : imageLargeApiUrl
              ? imageLargeApiUrl
              : assetsUrl("img/tcg/pokemon/card-placeholder.jpg")
        }
        className={`w-full absolute inset-0 rounded-card`}
        alt={`${name} card`}
        fill
      />
    </div>
  );
};

export default SmallCardImage;
