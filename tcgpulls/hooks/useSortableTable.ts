import { useMemo, useState } from "react";
import { OrderDirection } from "@/graphql/generated";

// Now K extends string (so it can be any string, not necessarily a key of T)
export type SortConfig<T, K extends string> = {
  key: K;
  direction: OrderDirection;
};

const useSortableData = <T, K extends string>(
  items: T[],
  initialConfig: SortConfig<T, K> | null = null,
  customCompare: (a: T, b: T, key: K) => number, // make this required
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T, K> | null>(
    initialConfig,
  );

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const compareValue = customCompare(a, b, sortConfig.key);
        return sortConfig.direction === OrderDirection.Asc
          ? compareValue
          : -compareValue;
      });
    }
    return sortableItems;
  }, [items, sortConfig, customCompare]);

  const requestSort = (key: K) => {
    let direction: OrderDirection = OrderDirection.Asc;
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === OrderDirection.Asc
    ) {
      direction = OrderDirection.Desc;
    }
    setSortConfig({ key, direction });
  };

  return { sortedItems, requestSort, sortConfig };
};

export default useSortableData;
