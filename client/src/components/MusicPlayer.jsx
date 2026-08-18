import React, { useEffect } from "react";

import { useMusic } from "../context/MusicContext";
import { AmbientPlayer } from "./ui/ambient-player";

const MusicPlayer = ({ autoPlay = false, compact = false }) => {
  const {
    songs,
    currentSong,
    currentIndex,
    isPlaying,
    volume,
    progress,
    togglePlay,
    setVolume,
    nextSong,
    prevSong,
    selectSong,
    seek,
  } = useMusic();

  useEffect(() => {
    if (autoPlay && !isPlaying) togglePlay();
    // autoPlay is an initial legacy request only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (compact) {
    return (
      <AmbientPlayer
        compact
        trackName={currentSong?.title || "Ambient"}
        subtitle="Quiet Mix"
        playing={isPlaying}
        progress={progress * 100}
        volume={volume * 100}
        onTogglePlay={togglePlay}
      />
    );
  }

  return (
    <div className="space-y-3">
      <AmbientPlayer
        trackName={currentSong?.title || "Ambient"}
        subtitle="Quiet Mix"
        playing={isPlaying}
        progress={progress * 100}
        volume={volume * 100}
        onTogglePlay={togglePlay}
        onPrevious={prevSong}
        onNext={nextSong}
        onSeek={(value) => seek(value / 100)}
        onVolumeChange={(value) => setVolume(value / 100)}
      />

      <div className="rounded-xl border border-border bg-card p-2 shadow-panel">
        <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Library
        </p>
        <div className="space-y-1">
          {songs.map((song, index) => (
            <button
              key={song.title}
              type="button"
              onClick={() => selectSong(index)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] outline-none transition-colors focus-visible:shadow-focus ${
                index === currentIndex
                  ? "bg-primary/[0.08] text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span className="truncate">{song.title}</span>
              {index === currentIndex ? (
                <span className="ml-3 size-2 shrink-0 rounded-full bg-shigo-signal" aria-label="Current track" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
