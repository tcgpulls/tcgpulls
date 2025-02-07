import { PokemonCard } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";

type Props = {
  flavorText: PokemonCard["flavorText"];
};

const FlavorText = async ({ flavorText }: Props) => {
  const t = await getTranslations("common");

  return (
    <section>
      <h3 className="text-lg font-semibold mb-1">{t("description")}</h3>
      <p className="flex items-center gap-2 p-4 bg-primary-800 text-sm text-primary-400 rounded-xl">
        {flavorText}
      </p>
    </section>
  );
};

export default FlavorText;
