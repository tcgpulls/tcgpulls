import Card from "@/components/misc/Card";
import { NoticeT } from "@/types/Notice";
import { MdError, MdInfo, MdWarning } from "react-icons/md";
import { ReactNode } from "react";
import clsx from "clsx";
import { FaCircleCheck } from "react-icons/fa6";

type Props = {
  type: NoticeT["type"];
  message: string;
};

const icons: { [key: string]: ReactNode } = {
  success: <FaCircleCheck size={24} />,
  error: <MdError size={24} />,
  warning: <MdWarning size={24} />,
  info: <MdInfo size={24} />,
};

const bgClasses: Record<NoticeT["type"], string> = {
  success: "bg-success-600",
  error: "bg-error-600",
  warning: "bg-warning-600",
  info: "bg-info-600",
};

const Notice = async ({ type = "info", message }: Props) => {
  return (
    <Card
      className={clsx(
        "flex justify-center items-center gap-2 text-center p-8",
        bgClasses[type],
      )}
    >
      {icons[type]}
      <p className={`font-semibold text-sm`}>{message}</p>
    </Card>
  );
};

export default Notice;
