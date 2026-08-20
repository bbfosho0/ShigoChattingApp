import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "components/ui/button";
import { Slider } from "components/ui/slider";
import { cn } from "lib/utils";
import { shigoSpringSoft } from "lib/shigo-motion";

export interface AmbientPlayerProps {
  trackName?: string;
  subtitle?: string;
  playing?: boolean;
  progress?: number;
  volume?: number;
  compact?: boolean;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
}

const bars = [5, 9, 14, 8, 18, 11, 20, 13, 7, 16, 10, 19, 12, 6, 15, 9, 17, 8, 13, 5];

export function AmbientPlayer({
  trackName = "Rainfall",
  subtitle = "Quiet Mix",
  playing = false,
  progress = 42,
  volume = 55,
  compact = false,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  className,
}: AmbientPlayerProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const normalizedVolume = Math.min(100, Math.max(0, volume));
  const reducedMotion = useReducedMotion();
  const animateBars = playing && !reducedMotion;

  if (compact) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-3 shadow-panel", className)}>
        <div className="flex items-center gap-3">
          <Button size="icon" onClick={onTogglePlay} aria-label={playing ? "Pause ambient audio" : "Play ambient audio"}>
            {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">{trackName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
          <motion.span
            className={cn("size-2 rounded-full", playing ? "bg-shigo-signal" : "bg-shigo-presence-offline")}
            aria-label={playing ? "Playing" : "Paused"}
            animate={playing && !reducedMotion ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
            transition={playing && !reducedMotion ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : shigoSpringSoft}
          />
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <motion.div className="h-full rounded-full bg-shigo-ambient" initial={false} animate={{ width: `${normalizedProgress}%` }} transition={shigoSpringSoft} />
        </div>
      </div>
    );
  }

  return (
    <section className={cn("rounded-xl border border-border bg-card p-5 shadow-panel", className)} aria-label="Ambient player">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-shigo-signal">Ambient</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{trackName}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {playing ? "playing" : "paused"}
        </span>
      </div>

      <div className="mt-6 flex h-10 items-end gap-1" aria-hidden="true">
        {bars.map((height, index) => (
          <motion.span
            data-shigo-spectrum-bar
            key={`${height}-${index}`}
            className={cn("min-w-0 flex-1 origin-bottom rounded-full", index / bars.length <= normalizedProgress / 100 ? "bg-shigo-ambient" : "bg-muted")}
            style={{ height: `${height}px` }}
            animate={animateBars ? { scaleY: [0.72, 1, 0.82], opacity: [0.72, 1, 0.78] } : { scaleY: 1, opacity: 1 }}
            transition={animateBars ? { duration: 0.85 + (index % 5) * 0.11, delay: (index % 4) * 0.035, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } : shigoSpringSoft}
          />
        ))}
      </div>

      <div className="mt-4">
        <Slider value={[normalizedProgress]} max={100} step={1} onValueChange={(values) => onSeek?.(values[0] ?? 0)} aria-label="Track progress" />
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <Button size="icon" variant="ghost" onClick={onPrevious} aria-label="Previous track"><SkipBack size={16} /></Button>
        <Button size="icon-lg" onClick={onTogglePlay} aria-label={playing ? "Pause ambient audio" : "Play ambient audio"}>
          {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={onNext} aria-label="Next track"><SkipForward size={16} /></Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Volume2 size={16} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
        <Slider value={[normalizedVolume]} max={100} step={1} onValueChange={(values) => onVolumeChange?.(values[0] ?? 0)} aria-label="Ambient volume" />
        <span className="w-9 text-right text-[11px] tabular-nums text-muted-foreground">{normalizedVolume}%</span>
      </div>
    </section>
  );
}
