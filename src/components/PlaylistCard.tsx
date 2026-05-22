import { ListVideo, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Playlist } from "@/mock/videos";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const first = playlist.videos[0];
  return (
    <Link href={`/playlist/${playlist.id}`} className="group grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-orange-400/50 hover:bg-white/[0.07] sm:grid-cols-[220px_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-md">
        <Image src={first.thumbnail} alt={playlist.title} fill className="object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 grid place-items-center bg-black/35"><Play className="size-9 fill-white" /></div>
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/75 px-2 py-1 text-xs"><ListVideo className="size-3" /> {playlist.videos.length}</span>
      </div>
      <div className="self-center">
        <h3 className="text-lg font-bold">{playlist.title}</h3>
        <p className="mt-1 text-sm text-neutral-400">{playlist.description}</p>
        <p className="mt-3 text-xs text-orange-300">{playlist.updatedAt}</p>
      </div>
    </Link>
  );
}
