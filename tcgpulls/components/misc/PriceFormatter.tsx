import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { PriceBadgeSide, PriceChangeState, PriceBadgeT } from "@/types/Price";
import React from "react";

// Define the mapping outside the component
const PRICE_CHANGE_STYLES = {
  [PriceChangeState.Increased]: {
    icon: <FaCaretUp size={10} className="text-success-500 mt-0.5" />,
    color: "text-success-500",
  },
  [PriceChangeState.Decreased]: {
    icon: <FaCaretDown size={10} className="text-error-500" />,
    color: "text-error-500",
  },
  [PriceChangeState.Unchanged]: {
    icon: <></>,
    color: "text-accent-500",
  },
};

const PriceFormatter = ({
  price,
  priceChangeState,
  currencySymbol = "$",
  side = PriceBadgeSide.Left,
}: PriceBadgeT) => {
  const { icon, color } = PRICE_CHANGE_STYLES[priceChangeState];
  const formattedPrice = parseFloat(price).toLocaleString();

  return (
    <div className="flex items-center gap-0.5">
      {icon}
      <span className={color}>
        {side === PriceBadgeSide.Left
          ? `${currencySymbol}${formattedPrice}`
          : `${formattedPrice}${currencySymbol}`}
      </span>
    </div>
  );
};

export default PriceFormatter;
