import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const SplashScreen = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ShigoChat — A quieter place to connect";
  }, []);
  const [progress, setProgress] = useState(0);

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

  return (
    <motion.main
      aria-label="Splash screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className={`sc-splash ${darkMode ? "sc-splash-dark" : ""}`}
    >
      <div className="sc-splash-grid" aria-hidden="true" />
      <div className="sc-splash-content">
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="sc-splash-mark"
          aria-hidden="true"
        >
          <span />
          <i />
        </motion.div>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          className="sc-splash-kicker"
        >
          SHIGOCHAT / PRIVATE ROOM
        </motion.p>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          className="sc-serif"
        >
          A quieter place to connect.
        </motion.h1>
        <div className="sc-splash-progress" aria-label={`Loading ${Math.round(progress)} percent`} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="sc-splash-footer">Make room for the conversation.</p>
    </motion.main>
  );
};

export default SplashScreen;
