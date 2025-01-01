import { Locale } from "@/i18n/routing";
import { TcgCategoryT, TcgLangT, TcgBrandT } from "@/types/Tcg";

export type UrlParamsKeyT = {
  locale: Locale;
  tcgBrand: TcgBrandT;
  tcgLang: TcgLangT;
  tcgCategory: TcgCategoryT;
  setId: string;
  cardId: string;
};

export type UrlParamsT = Promise<Partial<UrlParamsKeyT>>;

export type SearchParamsKeyT = {
  page: string;
};

export type SearchParamsT = Promise<Partial<SearchParamsKeyT>>;
