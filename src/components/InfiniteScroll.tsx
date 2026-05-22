"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getVideos } from "@/services/mockApi";
import { SkeletonLoader } from "./SkeletonLoader";
import { VideoGrid } from "./VideoGrid";

export function InfiniteScroll({ category, query }: { category?: string; query?: string }) {
  const { ref, inView } = useInView({ rootMargin: "600px" });
  const result = useInfiniteQuery({
    queryKey: ["videos", category, query],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getVideos({ page: pageParam, category, query }),
    getNextPageParam: (page) => page.nextPage,
  });

  useEffect(() => {
    if (inView && result.hasNextPage && !result.isFetchingNextPage) {
      result.fetchNextPage();
    }
  }, [inView, result]);

  const items = result.data?.pages.flatMap((page) => page.items) ?? [];

  if (result.isLoading) return <SkeletonLoader count={18} />;

  return (
    <>
      <VideoGrid videos={items} />
      <div ref={ref} className="py-8">
        {result.isFetchingNextPage ? <SkeletonLoader count={6} /> : null}
      </div>
    </>
  );
}
