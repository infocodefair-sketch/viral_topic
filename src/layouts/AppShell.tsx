import { MobileNav } from "@/components/MobileNav";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,138,0,0.14),transparent_32rem),var(--background)] text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
