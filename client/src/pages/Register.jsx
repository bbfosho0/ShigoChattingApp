import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { ThemeContext } from "../context/ThemeContext";
import { AuthShell } from "../components/ui/auth-shell.tsx";
import { Button } from "../components/ui/button.tsx";
import { ShigoAuthForm } from "../components/ui/shigo-auth-form.tsx";
import { ShigoBrandArtwork } from "../components/ui/shigo-brand-artwork.tsx";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const redirectTimerRef = useRef(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => () => {
    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
  }, []);

  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);
      setAuthError("");
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      toast.success("Account created. Redirecting...");
      redirectTimerRef.current = window.setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Email or username may already exist.";
      setAuthError(message);
      toast.error(message);
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

      <div className="relative z-10 flex w-full justify-center">
        <AuthShell>
          <ShigoAuthForm
            mode="register"
            loading={loading}
            error={authError}
            onSubmit={handleRegister}
            onModeChange={(mode) => {
              if (mode === "login") navigate("/login");
            }}
          />
        </AuthShell>
      </div>
    </main>
  );
};

export default Register;
