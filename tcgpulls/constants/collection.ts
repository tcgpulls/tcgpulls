import {
  CollectionCardCondition,
  GradingCompany,
  GradingRating,
} from "@/types/Collection";

export const VALID_RATINGS_BY_GRADING_COMPANY: Record<
  GradingCompany,
  GradingRating[]
> = {
  [GradingCompany.PSA]: [
    GradingRating.TEN,
    GradingRating.NINE,
    GradingRating.EIGHT,
    GradingRating.SEVEN,
    GradingRating.SIX,
    GradingRating.FIVE,
    GradingRating.FOUR,
    GradingRating.THREE,
    GradingRating.TWO,
    GradingRating.ONE,
    GradingRating.OTHER,
  ],
  [GradingCompany.BECKETT]: [
    GradingRating.BLACK_LABEL,
    GradingRating.TEN,
    GradingRating.NINE_HALF,
    GradingRating.NINE_PLUS,
    GradingRating.NINE,
    GradingRating.EIGHT_HALF,
    GradingRating.EIGHT_PLUS,
    GradingRating.EIGHT,
    GradingRating.SEVEN,
    GradingRating.SIX,
    GradingRating.FIVE,
    GradingRating.FOUR,
    GradingRating.THREE,
    GradingRating.TWO,
    GradingRating.ONE,
    GradingRating.OTHER,
  ],
  [GradingCompany.CGC]: [
    GradingRating.TEN,
    GradingRating.NINE,
    GradingRating.EIGHT,
    GradingRating.SEVEN,
    GradingRating.SIX,
    GradingRating.FIVE,
    GradingRating.FOUR,
    GradingRating.THREE,
    GradingRating.TWO,
    GradingRating.ONE,
    GradingRating.OTHER,
  ],
};

/**
 * Options for the condition select, using the enum values.
 */
export const CONDITION_OPTIONS = [
  { label: "graded", value: CollectionCardCondition.GRADED },
  { label: "near-mint", value: CollectionCardCondition.NM },
  { label: "lightly-played", value: CollectionCardCondition.LP },
  { label: "moderately-played", value: CollectionCardCondition.MP },
  { label: "heavily-played", value: CollectionCardCondition.HP },
  { label: "damaged", value: CollectionCardCondition.DMG },
  { label: "unknown", value: CollectionCardCondition.UNK },
];

/**
 * Options for the grading company select, using the enum values.
 */
export const GRADING_COMPANY_OPTIONS = [
  { label: "psa", value: GradingCompany.PSA },
  { label: "beckett", value: GradingCompany.BECKETT },
  { label: "cgc", value: GradingCompany.CGC },
];

/**
 * Options for the grading rating select.
 * (Even though these values come from an enum, we build the array explicitly
 * so we can control the order and labels.)
 */
export const GRADING_RATING_OPTIONS = [
  { label: "black-label", value: GradingRating.BLACK_LABEL },
  { label: "ten", value: GradingRating.TEN },
  { label: "nine_half", value: GradingRating.NINE_HALF },
  { label: "nine_plus", value: GradingRating.NINE_PLUS },
  { label: "nine", value: GradingRating.NINE },
  { label: "eight_half", value: GradingRating.EIGHT_HALF },
  { label: "eight_plus", value: GradingRating.EIGHT_PLUS },
  { label: "eight", value: GradingRating.EIGHT },
  { label: "seven", value: GradingRating.SEVEN },
  { label: "six", value: GradingRating.SIX },
  { label: "five", value: GradingRating.FIVE },
  { label: "four", value: GradingRating.FOUR },
  { label: "three", value: GradingRating.THREE },
  { label: "two", value: GradingRating.TWO },
  { label: "one", value: GradingRating.ONE },
  { label: "other", value: GradingRating.OTHER },
];
