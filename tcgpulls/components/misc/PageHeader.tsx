import { Heading } from "@/components/catalyst-ui/heading";
import { ReactNode } from "react";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

type Props = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  withBackButton?: boolean;
  previousUrl?: string;
};

const PageHeader = ({
  title,
  description,
  icon,
  withBackButton,
  previousUrl = "",
}: Props) => {
  return (
    <div className={`pb-6`}>
      <div
        className={`inline-flex items-center ${previousUrl !== "" && "gap-4 "}`}
      >
        <Link
          href={previousUrl}
          className={`rounded-full bg-zinc-600 text-zinc-100 ${previousUrl !== "" && "hover:text-zinc-300 hover:bg-zinc-700"}`}
        >
          {withBackButton && <ChevronLeftIcon className={`w-7 h-7`} />}
        </Link>
        <Heading className={`flex gap-4 items-center`}>
          {icon && <div className={`w-6 h-6`}>{icon}</div>}
          {title}
        </Heading>
      </div>
      {description && <div className="text-zinc-500">{description}</div>}
    </div>
  );
};

export default PageHeader;
