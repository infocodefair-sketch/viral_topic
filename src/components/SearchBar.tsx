"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useUIStore } from "@/store/uiStore";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const addRecentSearch = useUIStore((state) => state.addRecentSearch);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    addRecentSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className="group relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={compact ? "Search" : "Search videos, creators, tags"}
        className="h-11 w-full rounded-full border border-white/10 bg-white/[0.06] pl-10 pr-20 text-sm outline-none transition focus:border-orange-400/70 focus:bg-white/[0.09]"
      />
      {value ? (
        <button type="button" onClick={() => setValue("")} className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-white">
          <X className="size-4" />
        </button>
      ) : null}
      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-black transition hover:bg-orange-400">
        <SlidersHorizontal className="size-4" />
      </button>
    </form>
  );
}
