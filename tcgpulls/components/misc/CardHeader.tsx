import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

const CardHeader = ({ title, subtitle, children }: Props) => {
  return (
    <div className={`w-full flex justify-between gap-4`}>
      <div className={`min-w-0 w-full`}>
        <h2 className="truncate flex justify-between items-center gap-2 font-semibold text-sm text-primary-50">
          <span>{title}</span>
        </h2>
        <p className={`truncate text-primary-400 text-xs pt-1`}>
          <span>{subtitle}</span>
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CardHeader;
