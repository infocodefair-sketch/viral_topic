import { ImageIcon, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VideoGrid } from "@/components/VideoGrid";
import { getVideos } from "@/services/videoRepository";
import { searchViralImages } from "@/services/viralImageRepository";

export async function SearchResults({ query }: { query: string }) {
  const [videoResults, imageTopics] = await Promise.all([
    getVideos({ query, limit: 24 }),
    searchViralImages(query, 12),
  ]);

  const hasQuery = Boolean(query.trim());
  const hasResults = videoResults.items.length > 0 || imageTopics.length > 0;

  return (
    <section>
      <h2 className="text-xl font-bold">{hasQuery ? `Results for "${query}"` : "Explore videos and images"}</h2>

      {!hasQuery ? (
        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-neutral-400">
          Search by video title, image topic title, or description.
        </div>
      ) : null}

      {hasQuery && !hasResults ? (
        <div className="mt-4 grid min-h-[260px] place-items-center rounded-lg border border-white/10 bg-white/[0.04] p-5 text-center">
          <div>
            <Search className="mx-auto size-10 text-orange-300" />
            <h3 className="mt-3 text-xl font-black">No results found</h3>
            <p className="mt-2 text-sm text-neutral-400">Try searching another video title or image topic.</p>
          </div>
        </div>
      ) : null}

      {imageTopics.length > 0 ? (
        <section className="py-6">
          <h3 className="mb-4 text-lg font-bold">Image topics</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {imageTopics.map((topic) => (
              <Link key={topic.id} href={`/viral-images/${topic.id}`} className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                <div className="relative aspect-video bg-black">
                  <Image src={topic.coverImageUrl} alt={topic.title} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-black">
                    <ImageIcon className="size-3" /> {topic.imageCount} images
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="line-clamp-2 text-sm font-bold">{topic.title}</h4>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{topic.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {videoResults.items.length > 0 ? (
        <section className="py-6">
          <h3 className="mb-4 text-lg font-bold">Videos</h3>
          <VideoGrid videos={videoResults.items} />
        </section>
      ) : null}
    </section>
  );
}
