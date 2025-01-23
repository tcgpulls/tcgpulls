import { ReactNode } from "react";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

type Props = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  withBackButton?: boolean;
  previousUrl?: string;
  size?: "small" | "medium" | "large";
};

const Header = ({
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
        <Link
          href={previousUrl}
          className={`rounded-full bg-primary-600 text-primary-100 ${previousUrl !== "" && "hover:text-primary-300 hover:bg-primary-700"}`}
        >
          {withBackButton && <ChevronLeftIcon className={`w-7 h-7`} />}
        </Link>
        <h1 className={`flex gap-4 items-center ${titleSizes[size]} font-bold`}>
          {icon && <div className={`w-6 h-6`}>{icon}</div>}
          {title}
        </h1>
      </div>
      {description && <div className="text-primary-500">{description}</div>}
    </div>
  );
};

export default Header;
