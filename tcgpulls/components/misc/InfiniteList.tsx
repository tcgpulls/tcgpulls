"use client";

import { ReactNode } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Spinner from "@/components/misc/Spinner";

type Props<T> = {
  initialItems: T[];
  fetchMore: (offset: number) => Promise<T[]>;
  pageSize: number;
  renderItem: (
    item: T,
    index: number,
    ref: (node: HTMLDivElement | null) => void,
  ) => ReactNode;
};

const InfiniteList = <T,>({
  initialItems,
  fetchMore,
  pageSize,
  renderItem,
}: Props<T>): ReactNode => {
  const { items, loading, lastItemRef } = useInfiniteScroll<T>({
    initialItems,
    fetchMore,
    pageSize,
  });

  return (
    <>
      {items.map((item, index) => {
        const ref = index === items.length - 1 ? lastItemRef : () => {};
        return (
          <div key={index} ref={ref}>
            {renderItem(item, index, ref)}
          </div>
        );
      })}
      {loading && (
        <div className={`w-full col-span-full py-10 flex justify-center`}>
          <Spinner />
        </div>
      )}
    </>
  );
};

export default InfiniteList;
