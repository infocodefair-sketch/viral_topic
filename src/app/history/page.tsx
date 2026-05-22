import { Clock3, Trash2 } from "lucide-react";
import { VideoGrid } from "@/components/VideoGrid";
import { AppShell } from "@/layouts/AppShell";
import { videos } from "@/mock/videos";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black"><Clock3 className="size-7 text-orange-400" /> History</h1>
            <p className="mt-1 text-sm text-neutral-400">Mock watch history UI with quick actions.</p>
          </div>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"><Trash2 className="mr-2 inline size-4" />Clear history</button>
        </div>
        <VideoGrid videos={videos.slice(9, 33)} />
      </div>
    </AppShell>
  );
}
