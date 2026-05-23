import { Radio, SlidersHorizontal, Star, UsersRound } from "lucide-react";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { AppShell } from "@/layouts/AppShell";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const comingSoon = {
    live: {
      eyebrow: "Live endpoint",
      title: "Coming soon",
      description: "Live streams are being prepared. Scheduled rooms, real-time chat, and event highlights will appear here once the channel opens.",
      Icon: Radio,
    },
    featured: {
      eyebrow: "Featured",
      title: "Coming soon",
      description: "Editorial picks and spotlight collections are being curated. Featured media will appear here once the section opens.",
      Icon: Star,
    },
    creators: {
      eyebrow: "Creators",
      title: "Coming soon",
      description: "Creator profiles, channels, and studio collections are being prepared for a richer discovery experience.",
      Icon: UsersRound,
    },
  }[category.toLowerCase()];

  return (
    <AppShell>
      <div className="px-4 sm:px-6">
        <CategoryTabs />
        <section className="py-6">
          {comingSoon ? (
            <ComingSoonSection {...comingSoon} />
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-black">{category}</h1>
                  <p className="mt-1 text-sm text-neutral-400">Lazy loaded videos with category and sorting controls.</p>
                </div>
                <div className="flex gap-2">
                  {["Most viewed", "Newest", "Top rated"].map((item) => <button key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">{item}</button>)}
                  <button className="rounded-full bg-orange-500 p-2 text-black"><SlidersHorizontal className="size-5" /></button>
                </div>
              </div>
              <InfiniteScroll category={category} />
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
