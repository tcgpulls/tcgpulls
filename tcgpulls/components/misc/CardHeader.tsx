import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

const CardHeader = ({ title, subtitle, children }: Props) => {
  return (
    <div className={`w-full flex justify-between gap-6`}>
      <div className={`min-w-0 grow`}>
        <div className="flex justify-between items-center gap-2">
          <h2 className="truncate font-semibold text-sm text-primary-50">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className={`truncate text-primary-400 text-xs pt-1`}>{subtitle}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
};

export default CardHeader;
