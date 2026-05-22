import { CategoryTabs } from "@/components/CategoryTabs";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { VideoGrid } from "@/components/VideoGrid";
import { AppShell } from "@/layouts/AppShell";
import { videos } from "@/mock/videos";

export default function HomePage() {
  const trending = videos.filter((video) => video.trending).slice(0, 6);
  const recommended = [...videos].sort((a, b) => b.likes - a.likes).slice(0, 12);

  return (
    <AppShell>
      <div className="px-4 sm:px-6">
        <CategoryTabs />
        <section className="py-6">
          <div className="glass mb-6 overflow-hidden rounded-lg p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-orange-300">Realtime feed</p>
                <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-5xl">Premium streaming discovery</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                  Placeholder-only frontend with fast grids, animated cards, creator metadata, and mock recommendations.
                </p>
              </div>
              <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 px-4 py-3">
                <p className="text-xs uppercase text-neutral-400">Watching now</p>
                <p className="font-mono text-2xl font-black text-orange-300">24,891</p>
              </div>
            </div>
          </div>
          <h2 className="mb-4 text-xl font-bold">Trending videos</h2>
          <VideoGrid videos={trending} />
        </section>
        <section className="py-6">
          <h2 className="mb-4 text-xl font-bold">Recommended for you</h2>
          <VideoGrid videos={recommended} />
        </section>
        <section className="py-6">
          <h2 className="mb-4 text-xl font-bold">Infinite feed</h2>
          <InfiniteScroll />
        </section>
      </div>
    </AppShell>
  );
}
