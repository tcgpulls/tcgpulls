import { Heading } from "@/components/catalyst-ui/heading";
import { ReactNode } from "react";

type Props = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
};

const PageHeader = ({ title, description, icon }: Props) => {
  return (
    <div className={`pb-8`}>
      <Heading className={`flex gap-4 items-center`}>
        {icon && <div className={`w-6 h-6`}>{icon}</div>}
        {title}
      </Heading>
      {description && <div className="text-zinc-500">{description}</div>}
    </div>
  );
};

export default PageHeader;
