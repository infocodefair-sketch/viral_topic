import { AdminGate } from "@/components/AdminGate";
import { AdminImageUploader } from "@/components/AdminImageUploader";
import { AppShell } from "@/layouts/AppShell";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6">
        <AdminGate>
          <AdminImageUploader />
        </AdminGate>
      </div>
    </AppShell>
  );
}
