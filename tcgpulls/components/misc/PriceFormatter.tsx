import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { PriceBadgeSide, PriceBadgeT } from "@/types/Price";

type Props = PriceBadgeT;

const PriceFormatter = ({
  price,
  priceActionCondition,
  currencySymbol = "$",
  side = PriceBadgeSide.Left,
}: Props) => {
  return (
    <>
      {priceActionCondition ? (
        <FaCaretDown className={`text-red-500 -mt-0.5`} />
      ) : (
        <FaCaretUp className={`text-green-500 mt-0.5`} />
      )}

      <span
        className={` ${priceActionCondition ? "text-red-500" : "text-green-500"}`}
      >
        {side === PriceBadgeSide.Left
          ? `${currencySymbol}${price}`
          : `${price}${currencySymbol}`}
      </span>
    </>
  );
};

export default PriceFormatter;
