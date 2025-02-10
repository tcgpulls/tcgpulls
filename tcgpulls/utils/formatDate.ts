import { format } from "date-fns";

const formatDateShort = (date: Date): string => {
  return format(date, "M/d/yyyy");
};

export { formatDateShort };
