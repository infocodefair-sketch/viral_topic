import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getViralImages } from "@/services/viralImageRepository";

export async function ViralImagesSection() {
  const images = await getViralImages(8);

  return (
    <section className="py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase text-orange-300">Visual pulse</p>
          <h2 className="mt-1 text-xl font-bold">Viral images</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">Fresh image topics with quick captions, curated for fast browsing between video sessions.</p>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <Link key={image.id} href={`/viral-images/${image.id}`} className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
              <div className="relative aspect-[4/5] bg-neutral-950">
                <Image
                  src={image.coverImageUrl}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  priority={index < 2}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-black">
                  <ImageIcon className="size-3" /> Viral
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-black/75 px-2 py-1 text-[10px] font-bold text-white">{image.imageCount} images</span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="line-clamp-2 text-sm font-black text-white">{image.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-300">{image.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass rounded-lg p-5 text-sm text-neutral-400">
          No viral images published yet. Add one from the admin panel to feature it here.
        </div>
      )}
    </section>
  );
}
