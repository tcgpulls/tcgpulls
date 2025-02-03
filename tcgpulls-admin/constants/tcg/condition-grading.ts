import { GradingCompany, GradingRating } from "../../types/Collection";

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
  ],
  [GradingCompany.BECK]: [
    GradingRating.TEN,
    GradingRating.NINE_HALF,
    GradingRating.NINE,
    GradingRating.EIGHT_HALF,
    GradingRating.EIGHT,
    GradingRating.SEVEN,
    GradingRating.SIX,
    GradingRating.FIVE,
    GradingRating.FOUR,
    GradingRating.THREE,
    GradingRating.TWO,
    GradingRating.ONE,
    GradingRating.NINE_PLUS,
    GradingRating.EIGHT_PLUS,
    GradingRating.BLACK_LABEL,
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
  ],
};
