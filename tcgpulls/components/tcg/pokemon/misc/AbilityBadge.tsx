import { getTranslations } from "next-intl/server";

const AbilityBadge = async () => {
  const t = await getTranslations("tcg.pokemon");
  return (
    <div
      className={`bg-red-700 text-gray-100 -skew-x-12 font-black tracking-wider text-xs px-3 rounded-full border-2 border-gray-400`}
    >
      {t("ability")}
    </div>
  );
};

export default AbilityBadge;
