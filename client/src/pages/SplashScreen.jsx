import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ShigoSplash } from "../components/ui/shigo-splash";

const SplashScreen = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const navigationTimerRef = useRef(null);

  useEffect(() => {
    const destination = user ? "/chat" : "/login";
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setProgress(100);
      navigationTimerRef.current = window.setTimeout(
        () => navigate(destination, { replace: true }),
        500
      );

      return () => {
        if (navigationTimerRef.current) {
          window.clearTimeout(navigationTimerRef.current);
          navigationTimerRef.current = null;
        }
      };
    }

    let currentProgress = 0;
    setProgress(0);

    const intervalId = window.setInterval(() => {
      currentProgress = Math.min(100, currentProgress + 2.5);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        window.clearInterval(intervalId);
        navigationTimerRef.current = window.setTimeout(
          () => navigate(destination, { replace: true }),
          400
        );
      }
    }, 50);

    return () => {
      window.clearInterval(intervalId);
      if (navigationTimerRef.current) {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
    };
  }, [navigate, user]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#090A0F]" aria-label="Splash screen">
      <ShigoSplash showAction={false} progress={progress} />
    </main>
  );
};

export default SplashScreen;
