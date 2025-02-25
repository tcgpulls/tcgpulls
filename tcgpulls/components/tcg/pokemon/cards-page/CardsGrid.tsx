import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const CardsGrid = ({ children, className }: Props) => {
  return (
    <div
      className={`
        grid
        gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        pb-12
        items-stretch
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default CardsGrid;
