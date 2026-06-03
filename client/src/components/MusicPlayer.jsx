import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import agosto from "../music/Agosto.mp3";
import bennyBronco from "../music/Benny Bronco - o k t o b u.mp3";
import dorc from "../music/Dor-c - Sunshine Rider.mp3";
import johnnyGorillas from "../music/Johnny Gorillas - Blue Morning.mp3";
import soulful from "../music/Soulful.mp3";

const SONGS = [
  { title: "Agosto", src: agosto },
  { title: "Benny Bronco - o k t o b u", src: bennyBronco },
  { title: "Dor-c - Sunshine Rider", src: dorc },
  { title: "Johnny Gorillas - Blue Morning", src: johnnyGorillas },
  { title: "Soulful", src: soulful },
];

const MusicPlayer = ({ autoPlay = false, volumeInitial = 0.2, compact = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(volumeInitial);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collapsed, setCollapsed] = useState(compact);
  const audioRef = useRef(null);

  const onEnded = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % SONGS.length);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = muted;

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error("Audio play error:", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying, volume, muted]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleMute = () => setMuted((m) => !m);
  const nextSong = () => setCurrentIndex((i) => (i + 1) % SONGS.length);
  const prevSong = () => setCurrentIndex((i) => (i - 1 + SONGS.length) % SONGS.length);

  const onTimeUpdate = () => {
    if (audioRef.current?.duration) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration);
    }
  };

  const onSeek = (e) => {
    if (audioRef.current?.duration) {
      const newTime = Number(e.target.value) * audioRef.current.duration;
      if (Number.isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setProgress(newTime / audioRef.current.duration);
      }
    }
  };

  const onVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  const track = SONGS[currentIndex];

  return (
    <section
      className={`select-none rounded-xl p-3 ${compact || collapsed ? "" : "p-5"}`}
      style={{
        background: "var(--sc-bubble-other)",
        border: "1px solid var(--sc-border)",
        boxShadow: "0 8px 32px var(--sc-shadow)",
      }}
      aria-label="Ambient music player"
    >
      <audio
        ref={audioRef}
        src={track.src}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        autoPlay={autoPlay}
      />

      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8rem] font-medium sc-text-primary" title={track.title} aria-live="polite">
            {track.title}
          </p>
          <p className="text-[0.7rem] sc-text-secondary">Ambient</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevSong} className="sc-icon-button h-7 w-7 rounded-lg" type="button" aria-label="Previous song">
            <SkipBack size={13} />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{
              background: "linear-gradient(135deg, var(--sc-accent), #c4b8e8)",
              border: 0,
              cursor: "pointer",
            }}
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: 1 }} />}
          </button>
          <button onClick={nextSong} className="sc-icon-button h-7 w-7 rounded-lg" type="button" aria-label="Next song">
            <SkipForward size={13} />
          </button>
          {!compact && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="sc-icon-button ml-1 h-7 w-7 rounded-lg"
              type="button"
              aria-label={collapsed ? "Expand music player" : "Collapse music player"}
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          )}
        </div>
      </div>

      <div className="relative mt-2 h-[3px] overflow-hidden rounded-full" style={{ background: "var(--sc-accent-glow)" }}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={onSeek}
          aria-label="Song progress"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: "rgba(164,146,212,0.65)",
            transition: "width 0.15s linear",
          }}
        />
      </div>

      {!compact && !collapsed && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="sc-icon-button h-8 w-8 rounded-lg" type="button" aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={onVolumeChange}
              aria-label="Volume"
              className="h-1 flex-1 cursor-pointer accent-[#a492d4]"
            />
          </div>

          <div className="mt-4 space-y-1">
            {SONGS.map((song, index) => (
              <button
                key={song.title}
                onClick={() => {
                  setCurrentIndex(index);
                  setProgress(0);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left transition"
                style={{
                  background: index === currentIndex ? "var(--sc-accent-soft)" : "transparent",
                  border: 0,
                  color: index === currentIndex ? "var(--sc-accent)" : "var(--sc-text-secondary)",
                  cursor: "pointer",
                }}
                type="button"
              >
                <span className="truncate text-[0.8rem]">{song.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MusicPlayer;
