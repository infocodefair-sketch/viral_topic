import { Clock3, ListVideo } from "lucide-react";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { AppShell } from "@/layouts/AppShell";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isWatchLater = id === "playlist-2";

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <ComingSoonSection
          eyebrow={isWatchLater ? "Watch later" : "Playlists"}
          title="Coming soon"
          description={
            isWatchLater
              ? "Saved media and watch-later queues are being prepared so users can return to videos and image topics easily."
              : "Playlist creation, queues, and curated collections are being prepared for this section."
          }
          Icon={isWatchLater ? Clock3 : ListVideo}
        />
      </div>
    </AppShell>
  );
}
