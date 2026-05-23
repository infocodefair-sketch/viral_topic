"use client";

import "video.js/dist/video-js.css";
import Hls from "hls.js";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import type { Video } from "@/mock/videos";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";
import { PlayerControls } from "./PlayerControls";

export function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(22);
  const { theaterMode, miniPlayer } = useUIStore();
  const source = video.streamUrl ?? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const sourceType = video.sourceMimeType ?? "application/x-mpegURL";

  useEffect(() => {
    if (video.kind === "image" || !videoRef.current || playerRef.current) return;
    playerRef.current = videojs(videoRef.current, {
      controls: false,
      fluid: true,
      preload: "metadata",
      playsinline: true,
      sources: [{ src: source, type: sourceType }],
    });

    if (sourceType === "application/x-mpegURL" && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(videoRef.current);
    }

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [source, sourceType, video.kind]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.play();
    else player.pause();
  }, [playing]);

  return (
    <motion.section
      layout
      className={cn(
        "relative overflow-hidden rounded-lg bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10",
        theaterMode && "rounded-none md:-mx-6",
        miniPlayer && "fixed bottom-20 right-4 z-50 w-[min(420px,calc(100vw-2rem))]",
      )}
    >
      <div className="relative aspect-video">
        {video.kind === "image" ? (
          <Image src={video.streamUrl ?? video.thumbnail} alt={video.title} fill priority className="object-contain" />
        ) : !playing ? (
          <Image src={video.thumbnail} alt={video.title} fill priority className="object-cover opacity-80" />
        ) : null}
        {video.kind !== "image" ? (
          <>
            <video ref={videoRef} className="video-js absolute inset-0 size-full object-cover" poster={video.thumbnail} />
            <button aria-label="Back 10 seconds" onDoubleClick={() => setProgress(Math.max(0, progress - 10))} className="absolute inset-y-0 left-0 w-1/3 md:hidden" />
            <button aria-label="Forward 10 seconds" onDoubleClick={() => setProgress(Math.min(100, progress + 10))} className="absolute inset-y-0 right-0 w-1/3 md:hidden" />
            <PlayerControls playing={playing} setPlaying={setPlaying} progress={progress} setProgress={setProgress} />
          </>
        ) : null}
      </div>
    </motion.section>
  );
}
