import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";
import { PokemonEnergyT } from "@/types/Pokemon";

type Props = {
  type: PokemonEnergyT;
  size?: number;
};

const EnergyIcon = ({ type, size = 20 }: Props) => {
  return (
    <span className={`border border-primary-100 rounded-full`}>
      <Image
        width={size}
        height={size}
        src={assetsUrl(`/img/tcg/pokemon/energy/${type.toLowerCase()}.png`)}
        alt={`Pokemon ${type} type`}
      />
    </span>
  );
};

export default EnergyIcon;
