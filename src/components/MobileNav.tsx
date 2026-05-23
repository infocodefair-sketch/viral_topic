"use client";

import { Clapperboard, Flame, History, Home, Search, UserRound } from "lucide-react";
import Link from "next/link";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/viral-videos", icon: Clapperboard, label: "Viral" },
  { href: "/category/Trending", icon: Flame, label: "Trending" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/history", icon: History, label: "History" },
  { href: "/profile/creator-1", icon: UserRound, label: "Profile" },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-6 border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="grid place-items-center gap-0.5 text-[11px] font-medium text-neutral-400 hover:text-orange-300">
          <item.icon className="size-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
