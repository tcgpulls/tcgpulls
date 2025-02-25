import { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  leftEl: ReactNode;
  rightEl: ReactNode;
};

const ListHeader = ({ title, leftEl, rightEl }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 px-8 py-6 bg-primary-800 rounded-md shadow mb-4">
      <div className="flex-shrink-0 w-full sm:w-auto flex justify-center border-b sm:border-b-0 sm:border-r border-primary-700 pb-8 sm:pr-8 py-6">
        {leftEl}
      </div>

      {/* Set Info */}
      <div className={`flex flex-col gap-1 space-y-4`}>
        {title && (
          <h1 className="flex items-end gap-4 font-bold text-primary-100">
            <span className={`text-2xl sm:text-3xl`}>{title}</span>
          </h1>
        )}
        <div>{rightEl}</div>
      </div>
    </div>
  );
};

export default ListHeader;
