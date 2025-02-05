import { ReactNode } from "react";
import classNames from "clsx";

type Props = {
  children: ReactNode;
  isClickable?: boolean; // Toggle hover effect
  className?: string; // Allow parent to pass additional classes
};

const Card = ({ children, isClickable = false, className, ...rest }: Props) => {
  return (
    <div
      className={classNames(
        "bg-primary-800 rounded-xl shadow-md p-2 transition-transform",
        {
          "hover:shadow-xl hover:-translate-y-0.5 cursor-pointer": isClickable,
          "cursor-default": !isClickable,
        },
        className, // parent provided classes will be merged here
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
