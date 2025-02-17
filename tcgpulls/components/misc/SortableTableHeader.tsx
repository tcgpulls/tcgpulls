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
      <div className={`flex items-center gap-1`}>
        {label}
        <div className={`inline-block relative w-4 h-4`}>
          {sortConfig && sortConfig.key === field && (
            <>
              {sortConfig.direction === OrderDirection.Asc ? (
                <FaCaretUp className="absolute inset-0" />
              ) : (
                <FaCaretDown className="absolute inset-0" />
              )}
            </>
          )}
        </div>
      </div>
    </TableHeader>
  );
}
