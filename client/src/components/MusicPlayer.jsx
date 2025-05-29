import React, { useEffect, useState, useRef, useCallback } from "react";
import { Moon, Sun, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

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

const MusicPlayer = ({ autoPlay = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.2);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(null);

    const onEnded = useCallback(() => {
        setCurrentIndex((i) => (i + 1) % SONGS.length);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.muted = muted;
            if (isPlaying) {
                audioRef.current.play().catch((e) => { console.error("Audio play error:", e); });
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentIndex, isPlaying, volume, muted]);

    const togglePlay = () => setIsPlaying((p) => !p);
    const toggleMute = () => setMuted((m) => !m);

    const nextSong = () => setCurrentIndex((i) => (i + 1) % SONGS.length);
    const prevSong = () => setCurrentIndex((i) => (i - 1 + SONGS.length) % SONGS.length);

    const onTimeUpdate = () => {
        if (audioRef.current && audioRef.current.duration) {
            setProgress(audioRef.current.currentTime / audioRef.current.duration);
        }
    };

    const onSeek = (e) => {
        if (audioRef.current && audioRef.current.duration) {
            const newTime = e.target.value * audioRef.current.duration;
            if (Number.isFinite(newTime) && newTime >= 0 && newTime <= audioRef.current.duration) {
                audioRef.current.currentTime = newTime;
                setProgress(newTime / audioRef.current.duration);
            }
        }
    };

    const onVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
        setMuted(false);
    };

    return (
        <section className="glassmorphic flex flex-col space-y-2 p-4 rounded-xl border border-white/20 shadow-lg bg-white/30 dark:bg-black/30 backdrop-blur-lg max-w-md mx-auto select-none">
            <audio
                ref={audioRef}
                src={SONGS[currentIndex].src}
                onEnded={onEnded}
                onTimeUpdate={onTimeUpdate}
                autoPlay={false}
            />
            <h4 className="text-center font-inter font-normal text-base text-white select-none pointer-events-none">
                {SONGS[currentIndex].title}
            </h4>
            <div className="flex items-center space-x-6 justify-center">
                <button
                    onClick={prevSong}
                    aria-label="Previous Song"
                    className="hover:text-indigo-300 transition"
                >
                    <SkipBack size={24} />
                </button>
                <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="text-xl hover:text-indigo-300 transition"
                >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <button
                    onClick={nextSong}
                    aria-label="Next Song"
                    className="hover:text-indigo-300 transition"
                >
                    <SkipForward size={24} />
                </button>
            </div>
            <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                onChange={onSeek}
                aria-label="Song Progress"
                className="w-full h-1 rounded-lg bg-indigo-600 cursor-pointer"
            />
            <div className="flex items-center space-x-4 w-full">
                <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="hover:text-indigo-300 transition">
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
        </section>
    );
};

export default MusicPlayer;