import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import desktopDark from "../DesktopDarkBackgroundSplash.png";
import desktopLight from "../DesktopLightBackgroundSplash.png";
import mobileDark from "../MobileDarkBackgroundSplash.png";
import mobileLight from "../MobileLightBackgroundSplash.png";

const SplashScreen = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(intervalId);
          setTimeout(() => navigate(user ? "/chat" : "/login", { replace: true }), 400);
          return 100;
        }
        return current + 2.5;
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [navigate, user]);

  const bgImage = darkMode
    ? isMobile
      ? mobileDark
      : desktopDark
    : isMobile
      ? mobileLight
      : desktopLight;

  return (
    <motion.main
      aria-label="Splash screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 overflow-hidden"
    >
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div
        className="absolute inset-0"
        style={{
          background: darkMode
            ? "linear-gradient(180deg, rgba(9,13,26,0.35) 0%, rgba(9,13,26,0.55) 100%)"
            : "linear-gradient(180deg, rgba(246,242,251,0.1) 0%, rgba(246,242,251,0.45) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        >
          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <motion.path
              d="M32 8 C18 8, 8 19, 8 32 C8 45, 18 56, 32 56 C24 50, 20 42, 20 32 C20 22, 24 14, 32 8Z"
              fill={darkMode ? "#c4b8e8" : "#9b78d4"}
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <circle cx="38" cy="18" r="3" fill={darkMode ? "#e8e0f8" : "#e0d0f8"} opacity="0.6" />
            <circle cx="44" cy="28" r="2" fill={darkMode ? "#e8e0f8" : "#e0d0f8"} opacity="0.35" />
          </svg>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <h1
            className="sc-serif text-[2.6rem] font-medium leading-[1.15] tracking-normal"
            style={{
              color: darkMode ? "#e4e0f0" : "#2a1b5e",
              textShadow: darkMode
                ? "0 2px 24px rgba(0,0,0,0.5)"
                : "0 2px 16px rgba(255,255,255,0.6)",
            }}
          >
            ShigoChat
          </h1>
          <p
            className="mt-2 text-[0.92rem] tracking-[0.04em]"
            style={{
              color: darkMode ? "#c4b8e8" : "#7c5cbf",
              textShadow: darkMode
                ? "0 1px 12px rgba(0,0,0,0.4)"
                : "0 1px 8px rgba(255,255,255,0.5)",
            }}
          >
            A quieter place to connect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="relative mt-8 h-0.5 w-[150px] overflow-hidden rounded-full"
          style={{ background: darkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.4)" }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: darkMode
                ? "linear-gradient(90deg, #9b8ec4, #c4b8e8)"
                : "linear-gradient(90deg, #7c5cbf, #b89ee8)",
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </motion.div>
      </div>
    </motion.main>
  );
};

export default SplashScreen;
