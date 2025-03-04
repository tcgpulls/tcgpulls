export enum PriceChangeState {
  Increased = "increased",
  Decreased = "decreased",
  Unchanged = "unchanged",
}

export type PriceBadgeT = {
  price: string;
  priceChangeState: PriceChangeState;
  currencySymbol?: string;
  side?: PriceBadgeSide;
};

export enum PriceBadgeSide {
  Left = "left",
  Right = "right",
}
