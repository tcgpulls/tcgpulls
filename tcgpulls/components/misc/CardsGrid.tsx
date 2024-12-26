import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CardsGrid = ({ children }: Props) => {
  return (
    <div
      className={`
        grid
        gap-4
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        pb-12
      `}
    >
      {children}
    </div>
  );
};

export default CardsGrid;
