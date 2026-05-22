"use client";

import { Clock3 } from "lucide-react";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { useUIStore } from "@/store/uiStore";

export function SearchResults({ query }: { query: string }) {
  const recentSearches = useUIStore((state) => state.recentSearches);
  return (
    <section>
      <h2 className="text-xl font-bold">{query ? `Results for "${query}"` : "Explore videos"}</h2>
      <div className="my-4 flex flex-wrap gap-2">
        {recentSearches.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-neutral-300">
            <Clock3 className="size-3" /> {item}
          </span>
        ))}
      </div>
      <InfiniteScroll query={query} />
    </section>
  );
}
