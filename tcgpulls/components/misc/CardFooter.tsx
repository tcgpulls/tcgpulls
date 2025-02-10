import { ReactNode } from "react";

type Props = { children: ReactNode };

const CardFooter = ({ children }: Props) => {
  return (
    <div className="grow flex flex-wrap items-start gap-2">{children}</div>
  );
};

export default CardFooter;
