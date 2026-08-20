import React, { useContext, useState } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthShell } from "../components/ui/auth-shell.tsx";
import { Button } from "../components/ui/button.tsx";
import { ShigoAuthForm } from "../components/ui/shigo-auth-form.tsx";
import { ShigoBrandArtwork } from "../components/ui/shigo-brand-artwork.tsx";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const navigate = useNavigate();

  const clearFeedback = () => {
    setAuthError("");
    setAuthSuccess("");
  };

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      clearFeedback();
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/chat");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Login failed. Check your email and password.";
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async ({ email }) => {
    try {
      setLoading(true);
      clearFeedback();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        { email }
      );
      setAuthSuccess(
        res.data?.message ||
          "If an account exists for that email, a recovery link has been sent."
      );
    } catch (err) {
      const message =
        err.response?.status === 429
          ? "Too many recovery requests. Try again later."
          : "Recovery request could not be completed. Try again later.";
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (nextMode) => {
    clearFeedback();
    setLoading(false);
    if (nextMode === "register") {
      navigate("/register");
      return;
    }
    setMode(nextMode);
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
          <ShigoAuthForm
            mode={mode}
            loading={loading}
            error={authError}
            success={authSuccess}
            onSubmit={mode === "forgot" ? handleForgotPassword : handleLogin}
            showForgotPassword
            onModeChange={handleModeChange}
          />
        </AuthShell>
      </div>
    </main>
  );
};

export default Login;
