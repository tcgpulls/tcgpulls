import { ReactNode } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { Link } from "@/i18n/routing";

type Props = {
  title: string | ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  withBackButton?: boolean;
  previousUrl?: string;
  size?: "small" | "medium" | "large";
};

const PageNavigation = ({
  title,
  description,
  icon,
  size = "medium",
  withBackButton,
  previousUrl = "",
}: Props) => {
  const titleSizes: Record<string, string> = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
  };

  return (
    <div className={`pb-6`}>
      <div
        className={`inline-flex items-center ${previousUrl !== "" && "gap-4 "}`}
      >
        <Link href={previousUrl} className={`text-primary-100`}>
          <span
            className={`flex gap-4 items-center ${titleSizes[size]} font-bold ${previousUrl !== "" && "hover:text-primary-300"}`}
          >
            {withBackButton && (
              <span className={`bg-primary-600 rounded-full`}>
                <HiChevronLeft className={`w-7 h-7`} />
              </span>
            )}
            {icon && <div className={`w-6 h-6`}>{icon}</div>}
            {title}
          </span>
        </Link>
      </div>
      {description && <div className="text-primary-500">{description}</div>}
    </div>
  );
};

export default PageNavigation;
