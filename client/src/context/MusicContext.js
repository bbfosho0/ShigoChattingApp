import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import agosto from "../music/Agosto.mp3";
import bennyBronco from "../music/Benny Bronco - o k t o b u.mp3";
import dorc from "../music/Dor-c - Sunshine Rider.mp3";
import johnnyGorillas from "../music/Johnny Gorillas - Blue Morning.mp3";
import soulful from "../music/Soulful.mp3";

export const SONGS = [
  { title: "Agosto", src: agosto },
  { title: "Benny Bronco - o k t o b u", src: bennyBronco },
  { title: "Dor-c - Sunshine Rider", src: dorc },
  { title: "Johnny Gorillas - Blue Morning", src: johnnyGorillas },
  { title: "Soulful", src: soulful },
];

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSong = SONGS[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = muted;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Audio play error:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying, muted, volume]);

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio?.duration) setProgress(audio.currentTime / audio.duration);
  };

  const nextSong = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % SONGS.length);
    setProgress(0);
  }, []);

  const prevSong = () => {
    setCurrentIndex((index) => (index - 1 + SONGS.length) % SONGS.length);
    setProgress(0);
  };

  const selectSong = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const seek = (value) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    const nextTime = Number(value) * audio.duration;
    if (!Number.isFinite(nextTime)) return;
    audio.currentTime = nextTime;
    setProgress(nextTime / audio.duration);
  };

  return (
    <MusicContext.Provider
      value={{
        songs: SONGS,
        currentSong,
        currentIndex,
        isPlaying,
        muted,
        volume,
        progress,
        togglePlay: () => setIsPlaying((value) => !value),
        toggleMute: () => setMuted((value) => !value),
        setVolume: (value) => {
          setVolume(value);
          setMuted(false);
        },
        nextSong,
        prevSong,
        selectSong,
        seek,
      }}
    >
      <audio
        ref={audioRef}
        src={currentSong.src}
        onEnded={nextSong}
        onTimeUpdate={onTimeUpdate}
        preload="metadata"
      />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const value = useContext(MusicContext);
  if (!value) throw new Error("useMusic must be used inside MusicProvider");
  return value;
};
