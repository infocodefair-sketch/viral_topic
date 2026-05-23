import { CategoryTabs } from "@/components/CategoryTabs";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { ViralImagesSection } from "@/components/ViralImagesSection";
import { VideoGrid } from "@/components/VideoGrid";
import { AppShell } from "@/layouts/AppShell";
import { getVideos } from "@/services/videoRepository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { items } = await getVideos({ limit: 48 });
  const trending = items.filter((video) => video.trending).slice(0, 6);
  const recommended = [...items].sort((a, b) => b.likes - a.likes).slice(0, 12);

  return (
    <AppShell>
      <div className="px-4 sm:px-6">
        <CategoryTabs />
        <section className="py-6">
          <div className="glass mb-6 overflow-hidden rounded-lg p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-orange-300">Realtime feed</p>
                <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-5xl">Media library discovery</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                  Videos and images are loaded into a fast grid and watch experience with previews, playback, comments, and sharing.
                </p>
              </div>
              <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 px-4 py-3">
                <p className="text-xs uppercase text-neutral-400">Watching now</p>
                <p className="font-mono text-2xl font-black text-orange-300">24,891</p>
              </div>
            </div>
          </div>
          <h2 className="mb-4 text-xl font-bold">Latest uploads</h2>
          <VideoGrid videos={trending} />
        </section>
        <ViralImagesSection />
        <section className="py-6">
          <h2 className="mb-4 text-xl font-bold">Recommended media</h2>
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
