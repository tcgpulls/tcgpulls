import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { PokemonEnergyT } from "@/types/Pokemon";

type Props = {
  type: PokemonEnergyT;
  size?: number;
};

const EnergyIcon = ({ type, size = 20 }: Props) => {
  return (
    <Image
      width={size}
      height={size}
      src={assetsUrl(`/img/tcg/pokemon/energy/${type.toLowerCase()}.png`)}
      alt={`Pokemon ${type} type`}
    />
  );
};

export default EnergyIcon;
