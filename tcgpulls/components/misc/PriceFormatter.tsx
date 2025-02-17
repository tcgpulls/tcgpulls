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
    <div className={`flex items-center gap-1`}>
      {priceActionCondition ? (
        <FaCaretDown size={10} className={`text-red-500`} />
      ) : (
        <FaCaretUp size={10} className={`text-green-500 mt-0.5`} />
      )}

      <span
        className={` ${priceActionCondition ? "text-red-500" : "text-green-500"}`}
      >
        {side === PriceBadgeSide.Left
          ? `${currencySymbol}${price}`
          : `${price}${currencySymbol}`}
      </span>
    </div>
  );
};

export default PriceFormatter;
