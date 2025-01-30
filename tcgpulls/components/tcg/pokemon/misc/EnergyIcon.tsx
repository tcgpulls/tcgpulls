import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { PokemonEnergyT } from "@/types/Pokemon";

type Props = {
  type: PokemonEnergyT;
};

const EnergyIcon = ({ type }: Props) => {
  return (
    <Image
      width={20}
      height={20}
      src={assetsUrl(`/img/tcg/pokemon/energy/${type.toLowerCase()}.png`)}
      alt={`Pokemon ${type} type`}
    />
  );
};

export default EnergyIcon;
