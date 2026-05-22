import type { Video } from "@/mock/videos";
import { VideoCard } from "./VideoCard";

export function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 lg:grid-cols-4 2xl:grid-cols-6">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} priority={index < 6} />
      ))}
    </div>
  );
}
