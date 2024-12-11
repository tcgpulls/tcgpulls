import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SetGrid = ({ children }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {children}
    </div>
  );
};

export default SetGrid;
