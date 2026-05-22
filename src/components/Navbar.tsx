"use client";

import { Bell, Menu, Moon, Sun, Upload, UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { useUIStore } from "@/store/uiStore";

export function Navbar() {
  const { toggleSidebar, toggleTheme, theme } = useUIStore();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
        <button onClick={toggleSidebar} className="rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white" aria-label="Toggle sidebar">
          <Menu className="size-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 font-black tracking-normal">
          <span className="grid size-9 place-items-center rounded-lg bg-orange-500 text-black">VT</span>
          <span className="hidden text-lg sm:block">Viral Topic</span>
        </Link>
        <div className="mx-auto hidden w-full max-w-2xl md:block">
          <Suspense fallback={<div className="h-11 rounded-full bg-white/[0.06]" />}>
            <SearchBar />
          </Suspense>
        </div>
        <button className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-orange-400/60 hover:text-orange-300 lg:inline-flex">
          <Upload className="mr-2 size-4" /> Upload
        </button>
        <button onClick={toggleTheme} className="rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white" aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <button className="relative rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute right-1 top-1 size-2 rounded-full bg-orange-500" />
        </button>
        <Link href="/profile/creator-1" className="rounded-full bg-white/10 p-2 text-neutral-200 transition hover:bg-white/15">
          <UserRound className="size-5" />
        </Link>
      </div>
      <div className="px-3 pb-3 md:hidden">
        <Suspense fallback={<div className="h-11 rounded-full bg-white/[0.06]" />}>
          <SearchBar compact />
        </Suspense>
      </div>
    </header>
  );
}
