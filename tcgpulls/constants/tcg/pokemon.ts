// GENERAL CONSTANTS
import {
  TcgCardSortByT,
  TcgCollectionSortByT,
  TcgSetSortByT,
} from "@/types/Tcg";

export const POKEMON_SUPPORTED_LANGUAGES = ["en"];
export const POKEMON_SUPPORTED_TCG_LANGUAGES = ["en", "ja"];

// SETS CONSTANTS
export const POKEMON_SETS_WITH_SUBSETS: { [mainSetId: string]: string } = {
  swsh45: "swsh45sv",
  cel25: "cel25c",
  swsh9: "swsh9tg",
  swsh10: "swsh10tg",
  swsh11: "swsh11tg",
  swsh12: "swsh12tg",
  swsh12pt5: "swsh12pt5gg",
};

export const POKEMON_SETS_SORT_OPTIONS: TcgSetSortByT[] = [
  "releaseDate",
  "name",
];
export const POKEMON_SETS_PAGE_SIZE = 20;

// CARDS CONSTANTS
export const POKEMON_CARDS_SORT_OPTIONS: TcgCardSortByT[] = [
  "normalizedNumber",
  "name",
];
export const POKEMON_CARDS_PAGE_SIZE = 20;

export const POKEMON_COLLECTION_SORT_OPTIONS: TcgCollectionSortByT[] = [
  "acquiredAt",
  "price",
  "cardName",
];

export const POKEMON_COLLECTION_PAGE_SIZE = 20;

export const POKEMON_COLLECTION_DETAILS_PAGE_SIZE = 5;
