import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SetsGrid = ({ children }: Props) => {
  return (
    <div
      className={`
        grid
        gap-4
        grid-cols-1
        xs:grid-cols-2
        sm:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        pb-12
      `}
    >
      {children}
    </div>
  );
};

export default SetsGrid;
