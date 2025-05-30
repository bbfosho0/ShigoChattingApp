import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Moon,
  Sun,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
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

/**
 * MusicPlayer component - ambient music player with enhanced controls and collapse toggle.
 *
 * Features:
 * - Play/pause, previous/next track controls.
 * - Volume and mute toggle with slider.
 * - Progress bar with seek capability.
 * - Collapsible UI triggered by toggle button at top-right corner.
 * - When collapsed: only minimal header with song title and toggle button shown.
 * - Maintains playback and state across collapse/expand.
 *
 * @param {object} props
 * @param {boolean} props.autoPlay - start playing automatically on mount (default: false)
 */
const MusicPlayer = ({ autoPlay = false }) => {
  // State variables to track current song index, playing status, volume, mute, progress, and collapsed UI state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.2);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  // Ref to the underlying <audio> element for playback manipulation
  const audioRef = useRef(null);

  /**
   * Callback for handling the ended event on the audio element.
   * Advances to the next song automatically (loops in playlist).
   */
  const onEnded = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % SONGS.length);
  }, []);

  /**
   * Side effect to update audio element whenever song, play state,
   * volume, or muted state changes.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = muted;

    if (isPlaying) {
      audio
        .play()
        .catch((e) => {
          console.error("Audio play error:", e);
        });
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying, volume, muted]);

  // Event handlers to update playback status and toggle mute/play

  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleMute = () => setMuted((m) => !m);

  // Navigate to next or previous song indices with wrap-around

  const nextSong = () => setCurrentIndex((i) => (i + 1) % SONGS.length);
  const prevSong = () => setCurrentIndex((i) => (i - 1 + SONGS.length) % SONGS.length);

  /**
   * Update progress state based on audio currentTime / duration.
   * This updates slider UI.
   */
  const onTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration);
    }
  };

  /**
   * Seek within audio track based on slider input.
   * @param {Event} e
   */
  const onSeek = (e) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = e.target.value * audioRef.current.duration;
      if (Number.isFinite(newTime) && newTime >= 0 && newTime <= audioRef.current.duration) {
        audioRef.current.currentTime = newTime;
        setProgress(newTime / audioRef.current.duration);
      }
    }
  };

  /**
   * Handle volume slider change while unmuting audio.
   * @param {Event} e
   */
  const onVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  /**
   * Toggle collapsed UI state.
   * Collapsed: minimizes the UI to show only header with toggle button.
   */
  const toggleCollapse = () => setCollapsed((c) => !c);

  return (
    <section
      className={`glassmorphic flex flex-col p-4 rounded-xl border border-white/20 shadow-lg bg-white/30 dark:bg-black/30 backdrop-blur-lg max-w-md mx-auto select-none transition-all duration-300 ease-in-out ${
        collapsed ? "w-72 h-14" : "w-full max-w-md h-auto"
      }`}
      aria-label="Ambient music player"
    >
      {/* Audio element for playback */}
      <audio
        ref={audioRef}
        src={SONGS[currentIndex].src}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        autoPlay={autoPlay}
      />

      {/* Header with title and collapse toggle button */}
      <div className="flex items-center justify-between">
        <h4
          className="font-inter font-normal text-base text-white select-none truncate"
          title={SONGS[currentIndex].title}
          aria-live="polite"
        >
          {SONGS[currentIndex].title}
        </h4>
        <button
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand music player" : "Collapse music player"}
          className="ml-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="button"
        >
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Render full controls only when not collapsed */}
      {!collapsed && (
        <>
          {/* Playback controls: previous, play/pause, next */}
          <div className="flex items-center space-x-6 justify-center mt-3">
            <button
              onClick={prevSong}
              aria-label="Previous Song"
              className="hover:text-indigo-300 transition"
              type="button"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="text-xl hover:text-indigo-300 transition"
              type="button"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button
              onClick={nextSong}
              aria-label="Next Song"
              className="hover:text-indigo-300 transition"
              type="button"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Progress bar slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={onSeek}
            aria-label="Song Progress"
            className="w-full h-1 rounded-lg bg-indigo-600 cursor-pointer mt-4"
          />

          {/* Volume controls */}
          <div className="flex items-center space-x-4 w-full mt-3">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="hover:text-indigo-300 transition"
              type="button"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={onVolumeChange}
              aria-label="Volume"
              className="flex-grow h-1 rounded-lg bg-indigo-600 cursor-pointer"
            />
          </div>
        </>
      )}
    </section>
  );
};

export default MusicPlayer;