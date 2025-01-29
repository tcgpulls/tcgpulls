import { PokemonCard } from "@/graphql/generated";
import { getTranslations } from "next-intl/server";
import formatName from "@/utils/formatName";

type Props = {
  artist: PokemonCard["artist"];
};

const ArtistInfo = async ({ artist }: Props) => {
  const t = await getTranslations("common");

  return (
    <section>
      <h3 className="text-lg font-semibold mb-1">{t("artist")}</h3>
      <p className={`flex items-center gap-2 p-4 bg-primary-800 rounded-xl`}>
        {formatName(artist!)}
      </p>
    </section>
  );
};

export default ArtistInfo;
