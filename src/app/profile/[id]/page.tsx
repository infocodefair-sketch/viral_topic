import { BadgeCheck, Grid2X2, ListVideo, PlaySquare, UsersRound } from "lucide-react";
import Image from "next/image";
import { PlaylistCard } from "@/components/PlaylistCard";
import { VideoGrid } from "@/components/VideoGrid";
import { AppShell } from "@/layouts/AppShell";
import { playlists, videos } from "@/mock/videos";
import { formatViews } from "@/utils/format";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uploaded = videos.filter((video) => video.creator.id === id).slice(0, 18);
  const creator = uploaded[0]?.creator ?? videos[0].creator;

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
          <div className="relative h-44 bg-[linear-gradient(135deg,rgba(255,138,0,.55),rgba(255,255,255,.05)),url('https://picsum.photos/id/1035/1600/500')] bg-cover bg-center" />
          <div className="p-5">
            <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
              <Image src={creator.avatar} alt="" width={112} height={112} className="size-28 rounded-2xl border-4 border-black object-cover" />
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 text-3xl font-black">{creator.name}<BadgeCheck className="size-6 text-orange-400" /></h1>
                <p className="mt-1 text-sm text-neutral-400">{formatViews(creator.followers)} followers • {uploaded.length} uploads</p>
              </div>
              <button className="sm:ml-auto rounded-full bg-orange-500 px-5 py-2 text-sm font-black text-black hover:bg-orange-400">Subscribe</button>
            </div>
            <div className="mt-6 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
              {[
                ["Uploads", Grid2X2],
                ["Playlists", ListVideo],
                ["Community", UsersRound],
                ["Saved", PlaySquare],
              ].map(([label, Icon]) => (
                <button key={String(label)} className="inline-flex shrink-0 items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
                  <Icon className="mr-2 size-4" /> {String(label)}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="py-6">
          <h2 className="mb-4 text-xl font-bold">Uploaded videos</h2>
          <VideoGrid videos={uploaded.length ? uploaded : videos.slice(0, 12)} />
        </section>
        <section className="space-y-3 py-6">
          <h2 className="text-xl font-bold">Playlists</h2>
          {playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
        </section>
      </div>
    </AppShell>
  );
}
