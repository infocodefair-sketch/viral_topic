"use client";

import { Captions, Expand, Gauge, Minimize2, Pause, PictureInPicture2, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";

type Props = {
  playing: boolean;
  setPlaying: (value: boolean) => void;
  progress: number;
  setProgress: (value: number) => void;
};

export function PlayerControls({ playing, setPlaying, progress, setProgress }: Props) {
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(false);
  const { toggleTheater, toggleMiniPlayer } = useUIStore();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying(!playing);
      }
      if (event.key === "f") document.documentElement.requestFullscreen?.();
      if (event.key === "m") setMuted((value) => !value);
      if (event.key === "ArrowRight") setProgress(Math.min(100, progress + 5));
      if (event.key === "ArrowLeft") setProgress(Math.max(0, progress - 5));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, progress, setPlaying, setProgress]);

  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-3 opacity-100 transition md:p-5">
      <input
        aria-label="Seek"
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(event) => setProgress(Number(event.target.value))}
        className="mb-3 h-1 w-full accent-orange-500"
      />
      <div className="flex items-center gap-2">
        <button onClick={() => setPlaying(!playing)} className="grid size-10 place-items-center rounded-full bg-orange-500 text-black">
          {playing ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}
        </button>
        <button onClick={() => setMuted(!muted)} className="rounded-full p-2 text-white hover:bg-white/10">
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
        <input aria-label="Volume" type="range" min={0} max={100} defaultValue={muted ? 0 : 80} className="hidden w-24 accent-orange-500 sm:block" />
        <span className="font-mono text-xs text-neutral-300">{Math.floor(progress / 2)}:14 / 28:00</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setCaptions(!captions)} className={`rounded-full p-2 hover:bg-white/10 ${captions ? "text-orange-300" : "text-white"}`}><Captions className="size-5" /></button>
          <button onClick={() => setSpeed(speed === 2 ? 0.75 : speed + 0.25)} className="hidden items-center rounded-full px-3 py-2 text-xs font-bold text-white hover:bg-white/10 sm:inline-flex"><Gauge className="mr-1 size-4" /> {speed}x</button>
          <button onClick={toggleMiniPlayer} className="rounded-full p-2 text-white hover:bg-white/10"><PictureInPicture2 className="size-5" /></button>
          <button onClick={toggleTheater} className="rounded-full p-2 text-white hover:bg-white/10"><Minimize2 className="size-5" /></button>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="rounded-full p-2 text-white hover:bg-white/10"><Expand className="size-5" /></button>
        </div>
      </div>
    </div>
  );
}
