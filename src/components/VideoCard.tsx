"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Flame, ImageIcon, Play, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import type { Video } from "@/mock/videos";
import { formatViews, timeAgo } from "@/utils/format";
import { ShareModal } from "./ShareModal";

export const VideoCard = memo(function VideoCard({ video, priority = false }: { video: Video; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = typeof window === "undefined" ? `/watch/${video.id}` : `${window.location.origin}/watch/${video.id}`;

  return (
    <>
      <motion.article
        whileHover={{ y: -4, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group"
      >
        <div className="relative">
          <Link href={`/watch/${video.id}`} className="block">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-900 shadow-lg shadow-black/30 ring-1 ring-white/10 transition group-hover:shadow-orange-500/20">
              <Image
                src={hovered ? video.preview : video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 16vw"
                priority={priority}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white">{video.duration}</span>
              {video.hd ? <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-black text-black">HD</span> : null}
              {video.trending ? <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-black"><Flame className="size-3" /> Hot</span> : null}
              <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 grid place-items-center bg-black/20">
                <span className="grid size-12 place-items-center rounded-full bg-orange-500 text-black shadow-lg shadow-orange-500/40">
                  {video.kind === "image" ? <ImageIcon className="size-5" /> : <Play className="ml-0.5 size-5 fill-current" />}
                </span>
              </motion.div>
              {hovered ? <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-orange-500" /> : null}
            </div>
          </Link>
          <button
            onClick={() => setShareOpen(true)}
            className="absolute bottom-2 left-2 grid size-9 place-items-center rounded-full bg-black/75 text-white opacity-100 ring-1 ring-white/10 transition hover:bg-orange-500 hover:text-black sm:opacity-0 sm:group-hover:opacity-100"
            aria-label={`Share ${video.title}`}
          >
            <Share2 className="size-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Link href={`/watch/${video.id}`} className="shrink-0">
            <Image src={video.creator.avatar} alt="" width={34} height={34} className="size-8 rounded-full object-cover" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/watch/${video.id}`} className="block">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-100">{video.title}</h3>
              <p className="mt-1 flex items-center gap-1 truncate text-xs text-neutral-400">
                {video.creator.name}
                {video.creator.verified ? <BadgeCheck className="size-3 text-orange-400" /> : null}
              </p>
              <p className="text-xs text-neutral-500">{formatViews(video.views)} views - {timeAgo(video.uploadedAt)}</p>
            </Link>
          </div>
        </div>
      </motion.article>
      <ShareModal open={shareOpen} title={video.title} url={shareUrl} onClose={() => setShareOpen(false)} />
    </>
  );
});

