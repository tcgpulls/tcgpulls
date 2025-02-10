import { PokemonCard } from "@/graphql/generated";
import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";

type Props = { card: PokemonCard };

const CardImage = ({ card }: Props) => {
  const { name, imageLargeStorageUrl, imageLargeApiUrl } = card;
  return (
    <Image
      src={
        imageLargeStorageUrl
          ? assetsUrl(imageLargeStorageUrl!)
          : imageLargeApiUrl
            ? imageLargeApiUrl
            : assetsUrl("img/tcg/pokemon/card-placeholder.jpg")
      }
      alt={`${name} card`}
      width={460}
      height={586}
      className="object-contain rounded-card shadow-md"
    />
  );
};

export default CardImage;
