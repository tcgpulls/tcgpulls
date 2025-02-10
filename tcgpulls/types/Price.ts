export type PriceBadgeT = {
  price: number;
  priceActionCondition: boolean;
  currencySymbol?: string;
  side?: PriceBadgeSide;
};

export enum PriceBadgeSide {
  Left = "left",
  Right = "right",
}
