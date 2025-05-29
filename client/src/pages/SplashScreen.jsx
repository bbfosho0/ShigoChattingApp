import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const SplashScreen = () => {
  const [phase, setPhase] = useState("enter"); // enter, active, fadeout
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  // Define blobs with color depending on theme
  const blobs = darkMode
  ? [
      // same as before for dark mode
      { className: "absolute w-72 h-72 bg-purple-300/40 dark:bg-purple-800/20 rounded-full blur-3xl opacity-55 mix-blend-lighten left-[-4%] top-16", animationDuration: 15, animationDelay: 0 },
      { className: "absolute w-52 h-52 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50 mix-blend-lighten right-[7%] top-38", animationDuration: 18, animationDelay: 1.5 },
      { className: "absolute w-40 h-44 bg-pink-200/40 dark:bg-pink-700/15 rounded-full blur-2xl opacity-35 mix-blend-lighten left-24 bottom-20", animationDuration: 20, animationDelay: 3 },
      { className: "absolute w-64 h-36 bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-2xl opacity-35 mix-blend-lighten right-40 bottom-[14%]", animationDuration: 16, animationDelay: 4.5 },
    ]
  : [
      { className: "absolute w-72 h-72 bg-purple-500/80 rounded-full blur-3xl opacity-90 left-[-4%] top-16 shadow-lg", animationDuration: 15, animationDelay: 0 },
      { className: "absolute w-52 h-52 bg-blue-500/85 rounded-full blur-2xl opacity-85 right-[7%] top-38 shadow-lg", animationDuration: 18, animationDelay: 1.5 },
      { className: "absolute w-40 h-44 bg-pink-400/80 rounded-full blur-2xl opacity-80 left-24 bottom-20 shadow-md", animationDuration: 20, animationDelay: 3 },
      { className: "absolute w-64 h-36 bg-indigo-500/70 rounded-full blur-2xl opacity-75 right-40 bottom-[14%] shadow-md", animationDuration: 16, animationDelay: 4.5 },
    ];

const particles = darkMode
  ? [
      { key: 1, className: "absolute w-3 h-3 rounded-full bg-white/10 blur-md left-[5%] top-[15%]", animationDuration: 18 },
      { key: 2, className: "absolute w-5 h-5 rounded-full bg-white/20 blur-lg left-[74%] top-[12%]", animationDuration: 20 },
      { key: 3, className: "absolute w-2 h-2 rounded-full bg-white/15 blur-md left-[62%] top-[48%]", animationDuration: 15 },
      { key: 4, className: "absolute w-4 h-4 rounded-full bg-white/10 blur-lg right-[15%] bottom-[35%]", animationDuration: 18 },
      { key: 5, className: "absolute w-3 h-3 rounded-full bg-white/5 blur-sm right-[32%] bottom-[10%]", animationDuration: 20 },
    ]
  : [
      { key: 1, className: "absolute w-3 h-3 rounded-full bg-white/60 blur-md left-[5%] top-[15%] shadow-sm", animationDuration: 18 },
      { key: 2, className: "absolute w-5 h-5 rounded-full bg-white/70 blur-lg left-[74%] top-[12%] shadow", animationDuration: 20 },
      { key: 3, className: "absolute w-2 h-2 rounded-full bg-white/50 blur-md left-[62%] top-[48%] shadow-sm", animationDuration: 15 },
      { key: 4, className: "absolute w-4 h-4 rounded-full bg-white/40 blur-lg right-[15%] bottom-[35%] shadow-md", animationDuration: 18 },
      { key: 5, className: "absolute w-3 h-3 rounded-full bg-white/30 blur-sm right-[32%] bottom-[10%] shadow-sm", animationDuration: 20 },
    ];

const backgroundClass = darkMode
  ? "bg-gradient-to-br from-black to-gray-900"
  : "bg-gradient-to-br from-purple-300 via-blue-400 to-indigo-500";

  // Card shadow and border styles become more stable:
  // Remove animated opacity on wrapper, animate only inner text and highlight.

  useEffect(() => {
    let timeoutId;
    switch (phase) {
      case "enter":
        timeoutId = setTimeout(() => setPhase("active"), 1500);
        break;
      case "active":
        timeoutId = setTimeout(() => setPhase("fadeout"), 6000);
        break;
      case "fadeout":
        timeoutId = setTimeout(() => navigate("/login"), 2200);
        break;
      default:
        break;
    }
    return () => clearTimeout(timeoutId);
  }, [phase, navigate]);

  return (
    <main
      aria-label="Splash screen"
      className={`relative h-screen overflow-hidden flex items-center justify-center transition-colors duration-500 ${backgroundClass}`}   
    >
      {/* Floating blobs */}
      {blobs.map(({ className, animationDuration, animationDelay }, i) => (
        <motion.div
          key={i}
          className={className}
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: animationDuration,
            ease: "easeInOut",
            delay: animationDelay,
            repeat: Infinity,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Floating glass particles */}
      {particles.map(({ key, className, animationDuration }) => (
        <motion.div
          key={key}
          className={className}
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: animationDuration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          aria-hidden="true"
        />
      ))}

      {/* Main splash container */}
      <motion.div
        className="relative flex flex-col items-center justify-center px-12 py-8 md:px-20 md:py-14 min-w-[340px] rounded-3xl bg-white/30 dark:bg-black/30 backdrop-blur-4xl border border-white/25 dark:border-white/20 shadow-xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={phase === "fadeout" ? { opacity: 0, scale: 1.12 } : { opacity: 1, scale: 1 }}
        transition={{ duration: phase === "fadeout" ? 2.2 : 1.5, ease: "easeInOut" }}
      >
        {/* Glow gradient highlight */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-2rem] rounded-3xl blur-3xl bg-gradient-to-tr from-blue-400 to-purple-600 opacity-30"
          animate={{ opacity: [0.3, 0.43, 0.31, 0.44, 0.38] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        />

        <motion.h1
          className="relative text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05] drop-shadow-[0_0_8px] drop-shadow-blue-500/75 drop-shadow-purple-600/75 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent select-none"
          animate={
            phase === "fadeout"
              ? { opacity: 0, y: -22, scale: 1.06 }
              : { opacity: 1, y: [0, 3, 0], scale: [1, 1.02, 1] }
          }
          transition={{
            duration: phase === "fadeout" ? 1.3 : 11,
            ease: "easeInOut",
            repeat: phase === "fadeout" ? 0 : Infinity,
            delay: phase === "fadeout" ? 0 : 0.8,
          }}
        >
          ShigoChat
        </motion.h1>

        <motion.span
  className="relative mt-4 text-base md:text-lg font-light tracking-wide max-w-[320px] text-center"
  style={{
    color: darkMode ? "rgba(200, 180, 255, 0.85)" : "rgba(100, 80, 150, 0.85)", // pastel lavender shades
    textShadow: darkMode
      ? "0 0 5px rgba(200, 180, 255, 0.8)"
      : "0 0 4px rgba(150, 140, 180, 0.6)",
  }}
  animate={{ opacity: [0.3, 0.74, 0.88, 0.74], y: [4, 1, 3, 2] }}
  transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
>
  A gentle place for thoughts to drift
</motion.span>
      </motion.div>
    </main>
  );
};

export default SplashScreen;