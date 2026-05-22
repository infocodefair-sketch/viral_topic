import { Play, Repeat } from "lucide-react";
import Image from "next/image";
import { VideoCard } from "@/components/VideoCard";
import { AppShell } from "@/layouts/AppShell";
import { getPlaylist } from "@/services/mockApi";
import { VideoPlayer } from "@/player/VideoPlayer";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playlist = await getPlaylist(id);
  const current = playlist.videos[0];

  return (
    <AppShell>
      <div className="grid gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="min-w-0 space-y-5">
          <VideoPlayer video={current} />
          <div>
            <h1 className="text-3xl font-black">{playlist.title}</h1>
            <p className="mt-2 text-neutral-400">{playlist.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-black text-black"><Play className="mr-2 inline size-4 fill-current" />Play all</button>
              <button className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold"><Repeat className="mr-2 inline size-4" />Autoplay on</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {playlist.videos.slice(1, 9).map((video) => <VideoCard key={video.id} video={video} />)}
          </div>
        </section>
        <aside className="glass h-fit rounded-lg p-4">
          <h2 className="mb-4 text-lg font-bold">Queue</h2>
          <div className="space-y-3">
            {playlist.videos.map((video, index) => (
              <div key={video.id} className="grid grid-cols-[112px_1fr] gap-3 rounded-lg p-2 hover:bg-white/10">
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image src={video.thumbnail} alt="" fill className="object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 text-xs">{index + 1}</span>
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold">{video.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">{video.creator.name}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
