import { ReactNode } from "react";

type Props = {
  leftEl: ReactNode;
  rightEl: ReactNode;
};

const ListHeader = ({ leftEl, rightEl }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 px-8 py-6 bg-primary-800 rounded-md shadow mb-4">
      <div className="flex-shrink-0 border-r border-primary-700 pr-8 py-6">
        {leftEl}
      </div>

      {/* Set Info */}
      <div className={`flex flex-col gap-1 space-y-4`}>{rightEl}</div>
    </div>
  );
};

export default ListHeader;
