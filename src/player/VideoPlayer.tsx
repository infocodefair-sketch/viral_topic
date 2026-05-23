"use client";

import Hls from "hls.js";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Video } from "@/mock/videos";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";
import { PlayerControls } from "./PlayerControls";

export function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { theaterMode, miniPlayer } = useUIStore();
  const source = video.streamUrl ?? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const sourceType = video.sourceMimeType ?? "application/x-mpegURL";
  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (video.kind === "image" || !videoElement) return;

    setPlaying(false);
    setHasStarted(false);
    setCurrentTime(0);
    setDuration(0);

    const updateTime = () => setCurrentTime(videoElement.currentTime || 0);
    const updateDuration = () => setDuration(Number.isFinite(videoElement.duration) ? videoElement.duration : 0);
    const syncPlaying = () => setPlaying(!videoElement.paused && !videoElement.ended);

    if (sourceType === "application/x-mpegURL" && Hls.isSupported() && !videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(videoElement);
      hlsRef.current = hls;
    } else {
      videoElement.src = source;
    }

    videoElement.addEventListener("loadedmetadata", updateDuration);
    videoElement.addEventListener("durationchange", updateDuration);
    videoElement.addEventListener("timeupdate", updateTime);
    videoElement.addEventListener("play", syncPlaying);
    videoElement.addEventListener("pause", syncPlaying);
    videoElement.addEventListener("ended", syncPlaying);

    return () => {
      videoElement.pause();
      videoElement.removeEventListener("loadedmetadata", updateDuration);
      videoElement.removeEventListener("durationchange", updateDuration);
      videoElement.removeEventListener("timeupdate", updateTime);
      videoElement.removeEventListener("play", syncPlaying);
      videoElement.removeEventListener("pause", syncPlaying);
      videoElement.removeEventListener("ended", syncPlaying);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      videoElement.removeAttribute("src");
      videoElement.load();
    };
  }, [source, sourceType, video.kind]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.muted = muted;
  }, [muted]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.volume = volume;
  }, [volume]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.paused || videoElement.ended) {
      setHasStarted(true);
      videoElement.play().catch((error: unknown) => {
        console.error("Video playback failed", error);
        setPlaying(false);
      });
      return;
    }

    videoElement.pause();
  }, []);

  const seekPercent = useCallback(
    (value: number) => {
      const videoElement = videoRef.current;
      if (!videoElement || !duration) return;
      videoElement.currentTime = (Math.min(100, Math.max(0, value)) / 100) * duration;
      setCurrentTime(videoElement.currentTime);
    },
    [duration],
  );

  const skip = useCallback((seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const nextTime = Math.min(videoElement.duration || 0, Math.max(0, videoElement.currentTime + seconds));
    videoElement.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const changeVolume = useCallback((value: number) => {
    setVolume(value);
    if (value > 0) {
      setMuted(false);
    }
  }, []);

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
        ) : !hasStarted ? (
          <Image src={video.thumbnail} alt={video.title} fill priority className="object-cover opacity-80" />
        ) : null}
        {video.kind !== "image" ? (
          <>
            <video ref={videoRef} className="absolute inset-0 size-full object-cover" playsInline preload="metadata" poster={video.thumbnail} />
            <button aria-label="Back 10 seconds" onDoubleClick={() => skip(-10)} className="absolute inset-y-0 left-0 w-1/3 md:hidden" />
            <button aria-label="Forward 10 seconds" onDoubleClick={() => skip(10)} className="absolute inset-y-0 right-0 w-1/3 md:hidden" />
            <PlayerControls
              playing={playing}
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              muted={muted}
              volume={volume}
              playbackRate={playbackRate}
              onTogglePlay={togglePlay}
              onSeekPercent={seekPercent}
              onSkip={skip}
              onToggleMute={() => setMuted((value) => !value)}
              onVolumeChange={changeVolume}
              onPlaybackRateChange={setPlaybackRate}
            />
          </>
        ) : null}
      </div>
    </motion.section>
  );
}
