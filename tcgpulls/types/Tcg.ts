export type TcgBrandT = TcgBrand;
export type TcgCategoryT = TcgCategory;
export type TcgLangT = TcgLang;
export type TcgSetSortByT = TcgSetSortBy;
export type TcgCardSortByT = TcgCardSortBy;
export type TcgCollectionSortByT = TcgCollectionSortBy;
export type TcgCollectionDetailsSortByT = TcgCollectionDetailsSortBy;

export enum TcgBrand {
  Pokemon = "pokemon",
  OnePiece = "one-piece",
}

export enum TcgLang {
  En = "en",
  Ja = "ja",
}

export enum TcgSetSortBy {
  ReleaseDate = "releaseDate",
  Name = "name",
}

export enum TcgCardSortBy {
  NormalizedNumber = "normalizedNumber",
  Name = "name",
}

export enum TcgCategory {
  Sets = "sets",
  BoosterPack = "booster-packs",
}

export enum TcgCollectionSortBy {
  AcquiredAt = "acquiredAt",
  Price = "price",
  CardName = "cardName",
}

export enum TcgCollectionDetailsSortBy {
  AcquiredAt = "acquiredAt",
  Condition = "condition",
  GradingCompany = "gradingCompany",
  GradingRating = "gradingRating",
  Quantity = "quantity",
  Price = "price",
  Notes = "notes",
}
