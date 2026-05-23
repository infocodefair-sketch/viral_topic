"use client";

import { Clapperboard, Clock3, Flame, History, Home, ListVideo, PlaySquare, Radio, Star, UsersRound } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/viral-videos", label: "Viral Videos", icon: Clapperboard },
  { href: "/category/Trending", label: "Trending", icon: Flame },
  { href: "/category/Live", label: "Live", icon: Radio },
  { href: "/playlist/playlist-1", label: "Playlists", icon: ListVideo },
  { href: "/history", label: "History", icon: History },
  { href: "/category/Featured", label: "Featured", icon: Star },
  { href: "/category/Creators", label: "Creators", icon: UsersRound },
  { href: "/category/HD", label: "HD", icon: PlaySquare },
  { href: "/playlist/playlist-2", label: "Watch later", icon: Clock3 },
];

export function Sidebar() {
  const open = useUIStore((state) => state.sidebarOpen);

  return (
    <motion.aside
      animate={{ width: open ? 232 : 76 }}
      className="sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-white/10 bg-black/60 p-3 backdrop-blur-xl md:block"
    >
      <nav className="space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white">
            <item.icon className="size-5 shrink-0 text-orange-400" />
            <span className={cn("truncate", !open && "sr-only")}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
