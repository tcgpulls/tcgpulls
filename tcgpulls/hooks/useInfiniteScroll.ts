"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Props<T> = {
  initialItems: T[];
  fetchMore: (offset: number) => Promise<T[]>;
  pageSize: number;
};

export default function useInfiniteScroll<T>({
  initialItems,
  fetchMore,
  pageSize,
}: Props<T>) {
  // The final array of items
  const [items, setItems] = useState<T[]>(initialItems);

  // True while a fetch is in progress
  const [loading, setLoading] = useState(false);

  // The "page" index (0-based). Each new page increments
  const [page, setPage] = useState(0);

  // Whether we believe there are more items to load
  const [hasMore, setHasMore] = useState(true);

  // Intersection observer reference
  const observer = useRef<IntersectionObserver | null>(null);

  // A function to fetch the next chunk
  const loadMoreItems = useCallback(async () => {
    setLoading(true);
    const offset = page * pageSize;

    try {
      const newItems = await fetchMore(offset);

      setItems((prev) => [...prev, ...newItems]);

      // If we get fewer than a full page, that presumably means no more data
      const nextHasMore = newItems.length === pageSize;
      setHasMore(nextHasMore);
    } catch (err) {
      console.error("useInfiniteScroll: Error loading more items:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, pageSize]);

  // If page > 0, fetch next chunk
  useEffect(() => {
    if (page > 0) {
      loadMoreItems().then();
    }
  }, [page, loadMoreItems]);

  // Intersection observer callback
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      // Disconnect old observer
      if (observer.current) {
        observer.current.disconnect();
      }

      // Create a new observer
      observer.current = new IntersectionObserver((entries) => {
        // We only care about the first entry
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore],
  );

  // (Optional) Debug effect to log changes in items
  useEffect(() => {}, [items]);

  return { items, loading, lastItemRef };
}
