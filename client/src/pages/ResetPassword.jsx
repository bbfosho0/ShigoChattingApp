import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthShell } from "../components/ui/auth-shell.tsx";
import { Button } from "../components/ui/button.tsx";
import { ShigoBrandArtwork } from "../components/ui/shigo-brand-artwork.tsx";
import { ShigoResetPassword } from "../components/ui/shigo-reset-password.tsx";

const INVALID_MESSAGE = "This recovery link is invalid or has expired.";

const ResetPassword = () => {
  const auth = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const tokenRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    if (tokenRef.current !== null) return;

    const params = new URLSearchParams(window.location.search);
    tokenRef.current = params.get("token") || "";
    window.history.replaceState(window.history.state, "", window.location.pathname);

    if (!tokenRef.current) setStatus("invalid");
    setReady(true);
  }, []);

  const handleReset = async (newPassword) => {
    if (!tokenRef.current) {
      setStatus("invalid");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        token: tokenRef.current,
        newPassword,
      });

      tokenRef.current = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      auth?.setUser?.(null);
      setStatus("success");
    } catch (err) {
      if (err.response?.status === 400) {
        tokenRef.current = "";
        setStatus("invalid");
      } else {
        const message =
          err.response?.status === 429
            ? "Too many reset attempts. Try again later."
            : "Password reset could not be completed. Try again later.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-foreground sm:p-6">
      <ShigoBrandArtwork imageClassName="scale-[1.03]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-background/28 backdrop-blur-[2px] dark:bg-[#090A0F]/36" />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          onClick={toggleDarkMode}
          leadingIcon={darkMode ? Sun : Moon}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "Light" : "Dark"}
        </Button>
      </div>

      <div className="relative z-10 w-full">
        <AuthShell>
          {ready ? (
            <ShigoResetPassword
              status={status}
              loading={loading}
              error={error}
              onSubmit={handleReset}
              onBackToLogin={() => navigate("/login")}
            />
          ) : (
            <div role="status" className="text-sm text-muted-foreground">Checking recovery link...</div>
          )}
        </AuthShell>
      </div>
    </main>
  );
};

export { INVALID_MESSAGE };
export default ResetPassword;
