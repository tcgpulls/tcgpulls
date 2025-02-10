import { ReactNode } from "react";
import { TableHeader } from "@/components/catalyst-ui/table";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { OrderDirection } from "@/graphql/generated";

// Here K extends string instead of keyof T
export type SortableTableHeaderProps<K extends string> = {
  label: ReactNode;
  field: K;
  requestSort: (field: K) => void;
  sortConfig: { key: K; direction: OrderDirection } | null;
  className?: string;
};

export default function SortableTableHeader<K extends string>({
  label,
  field,
  requestSort,
  sortConfig,
  className = "",
}: SortableTableHeaderProps<K>) {
  return (
    <TableHeader
      className={`cursor-pointer select-none ${className}`}
      onClick={() => requestSort(field)}
    >
      {label}
      {sortConfig && sortConfig.key === field && (
        <>
          {sortConfig.direction === OrderDirection.Asc ? (
            <FaCaretUp className="inline-block ml-1 mt-0.5" />
          ) : (
            <FaCaretDown className="inline-block ml-1 -mt-0.5" />
          )}
        </>
      )}
    </TableHeader>
  );
}
