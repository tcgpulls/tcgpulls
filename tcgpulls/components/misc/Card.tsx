import { ReactNode } from "react";
import classNames from "clsx";

type Props = {
  children: ReactNode;
  isClickable?: boolean; // New prop to toggle hover effect
};

const Card = ({ children, isClickable = false }: Props) => {
  return (
    <div
      className={classNames(
        "bg-primary-800 rounded-xl shadow-md p-4 transition-transform",
        {
          "hover:shadow-xl hover:-translate-y-0.5 cursor-pointer": isClickable,
          "cursor-default": !isClickable,
        },
      )}
    >
      {children}
    </div>
  );
};

export default Card;
