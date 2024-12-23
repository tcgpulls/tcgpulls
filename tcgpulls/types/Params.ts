import { Locale } from "@/i18n/routing";
import { TcgCategoryT, TcgLangT, TcgTypeT } from "@/types/Tcg";

export type UrlParamsKeyT = {
  locale: Locale;
  tcgType: TcgTypeT;
  tcgLang: TcgLangT;
  tcgCategory: TcgCategoryT;
  setId: string;
};

export type UrlParamsT = Promise<Partial<UrlParamsKeyT>>;

export type SearchParamsKeyT = {
  page: string;
};

export type SearchParamsT = Promise<Partial<SearchParamsKeyT>>;
