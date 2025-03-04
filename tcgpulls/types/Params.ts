import { Locale } from "@/i18n/routing";
import { TcgCategoryT, TcgLangT, TcgBrandT } from "@/types/Tcg";
import { RedirectReasons } from "@/types/Redirect";

export type UrlParamsKeyT = {
  locale: Locale;
  tcgBrand: TcgBrandT;
  tcgLang: TcgLangT;
  tcgCategory: TcgCategoryT;
  setId: string;
  cardSlug: string;
};

export type UrlParamsT = Promise<Partial<UrlParamsKeyT>>;

export type SearchParamsKeyT = {
  page: string;
  requiresAuth: boolean;
  callbackUrl: string;
  redirectReason: RedirectReasons;
  error: string;
  fromPage: string;
};

export type SearchParamsT = Promise<Partial<SearchParamsKeyT>>;
