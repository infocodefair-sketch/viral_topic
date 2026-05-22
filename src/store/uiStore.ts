"use client";

import { create } from "zustand";

type Theme = "dark" | "light";

type UIState = {
  sidebarOpen: boolean;
  theaterMode: boolean;
  miniPlayer: boolean;
  autoplay: boolean;
  theme: Theme;
  recentSearches: string[];
  toggleSidebar: () => void;
  toggleTheater: () => void;
  toggleMiniPlayer: () => void;
  toggleAutoplay: () => void;
  toggleTheme: () => void;
  addRecentSearch: (search: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theaterMode: false,
  miniPlayer: false,
  autoplay: true,
  theme: "dark",
  recentSearches: ["neon", "studio", "creator picks"],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTheater: () => set((state) => ({ theaterMode: !state.theaterMode })),
  toggleMiniPlayer: () => set((state) => ({ miniPlayer: !state.miniPlayer })),
  toggleAutoplay: () => set((state) => ({ autoplay: !state.autoplay })),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [search, ...state.recentSearches.filter((item) => item !== search)].slice(0, 5),
    })),
}));
