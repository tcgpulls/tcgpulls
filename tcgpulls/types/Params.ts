export type UrlParamsKeyT = {
  locale: string;
  tcgType: string;
  originalId: string;
};

export type UrlParamsT = Promise<Partial<UrlParamsKeyT>>;

export type SearchParamsKeyT = {
  page: string;
};

export type SearchParamsT = Promise<Partial<SearchParamsKeyT>>;
