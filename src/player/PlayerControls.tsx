"use client";

import { Captions, Expand, Gauge, Minimize2, Pause, PictureInPicture2, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUIStore } from "@/store/uiStore";

type Props = {
  playing: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  muted: boolean;
  volume: number;
  playbackRate: number;
  onTogglePlay: () => void;
  onSeekPercent: (value: number) => void;
  onSkip: (seconds: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  onPlaybackRateChange: (value: number) => void;
};

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "0:00";

  const totalSeconds = Math.floor(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export function PlayerControls({
  playing,
  progress,
  currentTime,
  duration,
  muted,
  volume,
  playbackRate,
  onTogglePlay,
  onSeekPercent,
  onSkip,
  onToggleMute,
  onVolumeChange,
  onPlaybackRateChange,
}: Props) {
  const [captions, setCaptions] = useState(false);
  const { toggleTheater, toggleMiniPlayer } = useUIStore();
  const timeLabel = useMemo(() => `${formatTime(currentTime)} / ${formatTime(duration)}`, [currentTime, duration]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        onTogglePlay();
      }
      if (event.key === "f") document.documentElement.requestFullscreen?.();
      if (event.key === "m") onToggleMute();
      if (event.key === "ArrowRight") onSkip(10);
      if (event.key === "ArrowLeft") onSkip(-10);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSkip, onToggleMute, onTogglePlay]);

  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-3 opacity-100 transition md:p-5">
      <input
        aria-label="Seek"
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(event) => onSeekPercent(Number(event.target.value))}
        className="mb-3 h-1 w-full accent-orange-500"
      />
      <div className="flex items-center gap-2">
        <button onClick={onTogglePlay} className="grid size-10 place-items-center rounded-full bg-orange-500 text-black">
          {playing ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}
        </button>
        <button onClick={onToggleMute} className="rounded-full p-2 text-white hover:bg-white/10">
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : Math.round(volume * 100)}
          onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
          className="hidden w-24 accent-orange-500 sm:block"
        />
        <span className="font-mono text-xs text-neutral-300">{timeLabel}</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setCaptions(!captions)} className={`rounded-full p-2 hover:bg-white/10 ${captions ? "text-orange-300" : "text-white"}`}><Captions className="size-5" /></button>
          <button onClick={() => onPlaybackRateChange(playbackRate >= 2 ? 0.75 : playbackRate + 0.25)} className="hidden items-center rounded-full px-3 py-2 text-xs font-bold text-white hover:bg-white/10 sm:inline-flex"><Gauge className="mr-1 size-4" /> {playbackRate}x</button>
          <button onClick={toggleMiniPlayer} className="rounded-full p-2 text-white hover:bg-white/10"><PictureInPicture2 className="size-5" /></button>
          <button onClick={toggleTheater} className="rounded-full p-2 text-white hover:bg-white/10"><Minimize2 className="size-5" /></button>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="rounded-full p-2 text-white hover:bg-white/10"><Expand className="size-5" /></button>
        </div>
      </div>
    </div>
  );
}
