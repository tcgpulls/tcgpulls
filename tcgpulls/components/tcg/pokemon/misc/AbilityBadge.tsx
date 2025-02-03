import { getTranslations } from "next-intl/server";
import { PokemonCardAbility } from "@/graphql/generated";
import slugifyText from "@/utils/slugifyText";

type Props = {
  type: PokemonCardAbility["type"];
};

type TypeColorsT = {
  [key: string]: {
    bg: string;
    color: string;
  };
};

const AbilityBadge = async ({ type }: Props) => {
  if (!type) return null;
  const t = await getTranslations("tcg.pokemon");
  const sanitizedType = slugifyText(type);

  const typeColors: TypeColorsT = {
    ability: {
      bg: "bg-red-700",
      color: "text-gray-100",
    },
    "poke-body": {
      bg: "bg-green-300",
      color: "text-green-800",
    },
    "poke-power": {
      bg: "bg-red-500",
      color: "text-gray-900",
    },
  };

  return (
    <div
      className={`${typeColors[sanitizedType].bg} ${typeColors[sanitizedType].color} -skew-x-12 font-black tracking-wider text-xs px-3 rounded-full border-2 border-gray-400`}
    >
      {t(`${sanitizedType}`)}
    </div>
  );
};

export default AbilityBadge;
