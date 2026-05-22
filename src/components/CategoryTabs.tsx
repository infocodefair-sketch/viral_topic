"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/mock/videos";

export function CategoryTabs() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-40 -mx-4 overflow-x-auto border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="flex gap-2">
        {categories.map((category) => {
          const href = category === "Trending" ? "/" : `/category/${encodeURIComponent(category)}`;
          const active = pathname === href || (pathname === "/" && category === "Trending");
          return (
            <Link key={category} href={href} className="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:text-white">
              {active ? <motion.span layoutId="activeCategory" className="absolute inset-0 rounded-full bg-orange-500" /> : <span className="absolute inset-0 rounded-full bg-white/8" />}
              <span className="relative z-10 text-current mix-blend-normal">{category}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
