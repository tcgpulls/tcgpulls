import { ReactNode } from "react";

type Props = {
  text: string;
  children: ReactNode;
};

const EmptyList = async ({ text, children }: Props) => {
  return (
    <div className="flex flex-col items-center gap-8 py-32 p-4">
      <p className="text-center text-gray-600">{text}</p>
      {children}
    </div>
  );
};

export default EmptyList;
