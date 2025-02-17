// GENERAL CONSTANTS
import {
  TcgCardSortBy,
  TcgCardSortByT,
  TcgCollectionSortBy,
  TcgCollectionSortByT,
  TcgSetSortBy,
  TcgSetSortByT,
} from "@/types/Tcg";

export const POKEMON_SUPPORTED_TCG_LANGUAGES = ["en", "ja"];

export const POKEMON_SETS_SORT_OPTIONS: TcgSetSortByT[] = [
  TcgSetSortBy.ReleaseDate,
  TcgSetSortBy.Name,
];
export const POKEMON_SETS_PAGE_SIZE = 20;

// CARDS CONSTANTS
export const POKEMON_CARDS_SORT_OPTIONS: TcgCardSortByT[] = [
  TcgCardSortBy.NormalizedNumber,
  TcgCardSortBy.Name,
];
export const POKEMON_CARDS_PAGE_SIZE = 20;

export const POKEMON_COLLECTION_SORT_OPTIONS: TcgCollectionSortByT[] = [
  TcgCollectionSortBy.AcquiredAt,
  TcgCollectionSortBy.CardName,
  TcgCollectionSortBy.Price,
];

export const POKEMON_COLLECTION_PAGE_SIZE = 20;

export const POKEMON_COLLECTION_DETAILS_PAGE_SIZE = 5;
