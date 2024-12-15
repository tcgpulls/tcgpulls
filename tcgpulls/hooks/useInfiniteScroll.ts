"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import customLog from "@/utils/customLog";

type Props<T> = {
  initialItems: T[];
  fetchMore: (offset: number) => Promise<T[]>;
  pageSize: number;
};

const useInfiniteScroll = <T>({
  initialItems,
  fetchMore,
  pageSize,
}: Props<T>) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreItems = useCallback(async () => {
    setLoading(true);
    const offset = page * pageSize;
    try {
      const newItems = await fetchMore(offset);
      setItems((prevItems) => [...prevItems, ...newItems]);
      setHasMore(newItems.length === pageSize);
    } catch (error) {
      customLog("error", "Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, fetchMore]);

  useEffect(() => {
    if (page > 1) {
      loadMoreItems().then((r) => r);
    }
  }, [page, loadMoreItems]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return { items, loading, lastItemRef };
};

export default useInfiniteScroll;
