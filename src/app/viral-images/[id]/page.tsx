import { ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/layouts/AppShell";
import { getViralImage } from "@/services/viralImageRepository";

export const dynamic = "force-dynamic";

export default async function ViralImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await getViralImage(id);

  if (!topic) {
    notFound();
  }

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <Link href="/" className="mb-5 inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-orange-400/60 hover:text-orange-300">
          <ArrowLeft className="mr-2 size-4" /> Back
        </Link>

        <section className="glass overflow-hidden rounded-lg">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div className="relative min-h-[320px] bg-black sm:min-h-[460px]">
              <Image src={topic.coverImageUrl} alt={topic.title} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-black text-black">
                <ImageIcon className="size-4" /> {topic.imageCount} images
              </span>
            </div>
            <div className="flex flex-col justify-end p-5 sm:p-7">
              <p className="text-sm font-bold uppercase text-orange-300">Viral image topic</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-5xl">{topic.title}</h1>
              <p className="mt-4 text-sm leading-6 text-neutral-300">{topic.description}</p>
            </div>
          </div>
        </section>

        <section className="py-6">
          <h2 className="mb-4 text-xl font-bold">All images</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topic.images.map((image, index) => (
              <article key={image.publicId} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                <div className="relative aspect-[4/5] bg-black">
                  <Image src={image.imageUrl} alt={`${topic.title} ${index + 1}`} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2 py-1 text-[10px] font-bold text-white">{index + 1}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{topic.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
