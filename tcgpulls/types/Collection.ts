export enum CollectionCardCondition {
  GRADED = "graded", // Indicates the card has been professionally graded.
  NM = "near-mint",
  LP = "lightly-played",
  MP = "moderately-played",
  HP = "heavily-played",
  DMG = "damaged",
  UNK = "unknown",
}

export enum GradingCompany {
  PSA = "PSA",
  BECKETT = "Beckett",
  CGC = "CGC",
}

export enum GradingRating {
  // For PSA and CGC (using whole-number ratings):
  TEN = "10",
  NINE = "9",
  EIGHT = "8",
  SEVEN = "7",
  SIX = "6",
  FIVE = "5",
  FOUR = "4",
  THREE = "3",
  TWO = "2",
  ONE = "1",

  // For Beckett – additional options at the top end:
  NINE_HALF = "9.5",
  EIGHT_HALF = "8.5",

  // Legacy or modifier designations sometimes encountered:
  NINE_PLUS = "9+",
  EIGHT_PLUS = "8+",

  // Beckett’s special designation:
  BLACK_LABEL = "Black Label",

  // Fallback option for any non-standard or unanticipated ratings:
  OTHER = "Other",
}
