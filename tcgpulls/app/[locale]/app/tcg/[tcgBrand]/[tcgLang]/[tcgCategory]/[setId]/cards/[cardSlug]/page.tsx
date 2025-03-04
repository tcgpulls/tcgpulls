import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { SearchParamsT, UrlParamsT } from "@/types/Params";
import { ComponentType } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPokemonCard } from "@/lib/tcg/pokemon/getPokemonCard";

interface Props {
  params: UrlParamsT;
  searchParams: SearchParamsT;
}

const CardPage = async ({ params, searchParams }: Props) => {
  const { tcgBrand } = await params;

  if (!tcgBrand) {
    notFound();
  }

  // Dynamically import the CardPage component based on the tcgBrand
  let TcgBrandCardPage: ComponentType<{
    params: UrlParamsT;
    searchParams: SearchParamsT;
  }>;
  try {
    // Import the CardPage component based on the tcgBrand e.g: components/tcg/pokemon/CardPage
    TcgBrandCardPage = dynamic(
      () => import(`@/components/tcg/${tcgBrand}/card-page/CardPage`),
    );
  } catch (error) {
    console.error(`Failed to load CardPage for brand: ${tcgBrand}`, error);
    notFound();
  }

  return <TcgBrandCardPage params={params} searchParams={searchParams} />;
};

export default CardPage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale, cardSlug, tcgBrand } = await params;

  // Early return if not Pokemon (we'll add other TCGs later)
  if (tcgBrand !== "pokemon") return {};

  const t = await getTranslations({ locale, namespace: "card-page.metadata" });

  const card = await getPokemonCard(cardSlug);
  if (!card) return {};

  const {
    name,
    number,
    rarity,
    set,
    types = [],
    imageSmallStorageUrl,
    imageLargeStorageUrl,
  } = card;
  const cardTypesStr = types.join(", ");
  const setName = set?.name || "";
  const series = set?.series || "";

  return {
    title: t("title", { cardName: name, number, setName, series }),
    description: t("description", {
      cardName: name,
      setName,
      series,
      number,
      rarity: rarity || "",
      types: cardTypesStr,
    }),
    keywords: t("keywords", {
      cardName: name,
      setName,
      series,
      types: cardTypesStr,
    }),
    openGraph: {
      title: t("openGraph.title", { cardName: name, setName, series }),
      description: t("openGraph.description", {
        cardName: name,
        setName,
        series,
        rarity: rarity || "",
      }),
      siteName: t("openGraph.siteName"),
      type: "website",
      locale: locale,
      images: [
        {
          url: imageSmallStorageUrl || "",
          width: 746,
          height: 1040,
          alt: t("openGraph.imageAlt", { cardName: name }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title", { cardName: name, setName, series }),
      description: t("twitter.description", {
        cardName: name,
        setName,
        series,
        number,
      }),
      images: [imageSmallStorageUrl || "", imageLargeStorageUrl || ""],
    },
  };
}
