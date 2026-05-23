import { Clapperboard, FolderPlus } from "lucide-react";
import { VideoGrid } from "@/components/VideoGrid";
import { AppShell } from "@/layouts/AppShell";
import { getViralVideos } from "@/services/videoRepository";

export const dynamic = "force-dynamic";

export default async function ViralVideosPage() {
  const { items, total, configured } = await getViralVideos({ limit: 48 });

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <section className="glass mb-6 rounded-lg p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-orange-300">Viral feed</p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-normal sm:text-5xl">
                <Clapperboard className="size-8 text-orange-300 sm:size-10" />
                Viral Videos
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                A dedicated feed for videos from your separate viral media folder.
              </p>
            </div>
            <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 px-4 py-3">
              <p className="text-xs uppercase text-neutral-400">Available videos</p>
              <p className="font-mono text-2xl font-black text-orange-300">{total}</p>
            </div>
          </div>
        </section>

        {items.length > 0 ? (
          <VideoGrid videos={items} />
        ) : (
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
            <div className="max-w-md">
              <span className="mx-auto grid size-14 place-items-center rounded-lg bg-orange-500 text-black">
                <FolderPlus className="size-7" />
              </span>
              <h2 className="mt-4 text-2xl font-black">{configured ? "No viral videos yet" : "Connect a viral video folder"}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {configured
                  ? "Add video files to the configured folder and they will appear here automatically."
                  : "Create the new media folder, then add its id as VIRAL_VIDEOS_FOLDER_ID in .env.local."}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
