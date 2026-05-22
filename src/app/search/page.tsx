import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/features/videos/SearchResults";
import { AppShell } from "@/layouts/AppShell";
import { Suspense } from "react";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <AppShell>
      <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass h-fit rounded-lg p-4">
          <h1 className="text-2xl font-black">Search</h1>
          <div className="mt-4">
            <Suspense fallback={<div className="h-11 rounded-full bg-white/[0.06]" />}>
              <SearchBar />
            </Suspense>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm font-bold text-neutral-300">Filters</p>
            {["HD only", "Trending", "This week", "Verified creators"].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-neutral-300">
                {item}<input type="checkbox" className="accent-orange-500" />
              </label>
            ))}
          </div>
        </aside>
        <SearchResults query={q} />
      </div>
    </AppShell>
  );
}
