import Header from "@/components/misc/Header";
import { UrlParamsT } from "@/types/Params";
import { getPokemonCard } from "@/lib/tcg/pokemon/getPokemonCard";
import { getTranslations } from "next-intl/server";
import AbilitiesList from "@/components/tcg/pokemon/misc/AbilitiesList";
import AttacksList from "@/components/tcg/pokemon/misc/AttacksList";
import WeaknessesList from "@/components/tcg/pokemon/misc/WeaknessesList";
import BasicInfo from "@/components/tcg/pokemon/misc/BasicInfo";
import FlavorText from "@/components/tcg/pokemon/misc/FlavorText";
import ArtistInfo from "@/components/tcg/pokemon/misc/ArtistInfo";
import CardImage from "@/components/tcg/pokemon/misc/CardImage";
import ResistancesList from "@/components/tcg/pokemon/misc/ResistancesList";
import RetreatCost from "@/components/tcg/pokemon/misc/RetreatCost";
import { Divider } from "@/components/catalyst-ui/divider";

interface Props {
  params: UrlParamsT;
}

const PokemonCardPage = async ({ params }: Props) => {
  const { locale, tcgBrand, tcgCategory, tcgLang, cardSlug } = await params;

  // i18n translations
  const t = await getTranslations();

  try {
    // Fetch card data with our updated query
    const card = await getPokemonCard(cardSlug);

    if (!card) {
      return <p>{t("card-page.not-found")}</p>;
    }

    // Setup
    const {
      tcgSetId,
      flavorText,
      artist,
      set,
      attacks,
      abilities,
      weaknesses,
      resistances,
      retreatCost,
    } = card;

    return (
      <>
        {/* Header */}
        <Header
          title={`${set?.name}`}
          size="small"
          withBackButton
          previousUrl={`/${locale}/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}/${tcgSetId}`}
        />

        {/* Main Content Container */}
        <div className="flex flex-col md:flex-row gap-8 py-4 md:py-6">
          {/* Left Column: Card Image */}
          <div className="flex justify-center min-w-[420px] items-start">
            <CardImage card={card} />
          </div>

          {/* Right Column: Card Info */}
          <div className="flex flex-col gap-4 grow max-w-[520px]">
            <BasicInfo card={card} tcgLang={tcgLang!} />

            <Divider />

            {flavorText && <FlavorText flavorText={flavorText} />}

            {abilities && abilities.length > 0 && (
              <AbilitiesList abilities={abilities} />
            )}

            {attacks && attacks.length > 0 && <AttacksList attacks={attacks} />}

            <div className={`grid grid-cols-3 gap-4`}>
              <WeaknessesList weaknesses={weaknesses!} />
              <ResistancesList resistances={resistances} />
              <RetreatCost retreatCost={retreatCost} />
            </div>

            {artist && <ArtistInfo artist={artist} />}
          </div>
        </div>
      </>
    );
  } catch (error) {
    if (error instanceof Error) {
      return (
        <p className="text-red-600">
          {t("common.error")}: {error.message}
        </p>
      );
    }
    return <p className="text-red-600">{t("common.error")}</p>;
  }
};

export default PokemonCardPage;
