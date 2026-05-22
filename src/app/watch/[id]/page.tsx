import { Bookmark, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { CommentCard } from "@/components/CommentCard";
import { VideoCard } from "@/components/VideoCard";
import { AppShell } from "@/layouts/AppShell";
import { getSuggested, getVideo } from "@/services/mockApi";
import { formatViews, timeAgo } from "@/utils/format";
import { VideoPlayer } from "@/player/VideoPlayer";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [video, suggested] = await Promise.all([getVideo(id), getSuggested(id)]);

  return (
    <AppShell>
      <div className="grid gap-6 px-4 py-5 sm:px-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 space-y-5">
          <VideoPlayer video={video} />
          <section>
            <h1 className="text-xl font-bold sm:text-2xl">{video.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
              <span>{formatViews(video.views)} views</span>
              <span>{timeAgo(video.uploadedAt)}</span>
              <span className="rounded-full bg-orange-500/15 px-3 py-1 text-orange-300">{video.category}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"><ThumbsUp className="mr-2 inline size-4" />{formatViews(video.likes)}</button>
              <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"><ThumbsDown className="mr-2 inline size-4" />Dislike</button>
              <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"><Share2 className="mr-2 inline size-4" />Share</button>
              <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"><Bookmark className="mr-2 inline size-4" />Save</button>
            </div>
          </section>
          <section className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Image src={video.creator.avatar} alt="" width={48} height={48} className="size-12 rounded-full" />
              <div className="min-w-0">
                <p className="font-bold">{video.creator.name}</p>
                <p className="text-sm text-neutral-400">{formatViews(video.creator.followers)} followers</p>
              </div>
              <button className="ml-auto rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black hover:bg-orange-400">Subscribe</button>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-300">{video.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">#{tag}</span>)}
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Comments</h2>
            {Array.from({ length: 5 }).map((_, index) => <CommentCard key={index} index={index} />)}
          </section>
        </div>
        <aside className="space-y-4">
          <h2 className="text-lg font-bold">Suggested videos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {suggested.map((item) => <VideoCard key={item.id} video={item} />)}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
