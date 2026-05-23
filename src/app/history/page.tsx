import { Clock3 } from "lucide-react";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { AppShell } from "@/layouts/AppShell";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <ComingSoonSection
          eyebrow="History"
          title="Coming soon"
          description="Watch history, resume playback, and quick cleanup controls are being prepared for this space."
          Icon={Clock3}
        />
      </div>
    </AppShell>
  );
}
