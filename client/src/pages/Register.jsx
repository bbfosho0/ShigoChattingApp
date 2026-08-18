import React, { useContext, useState } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { ThemeContext } from "../context/ThemeContext";
import { AuthShell } from "../components/ui/auth-shell";
import { Button } from "../components/ui/button";
import { ShigoAuthForm } from "../components/ui/shigo-auth-form";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

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
      window.setTimeout(() => navigate("/login"), 900);
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
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-4 text-foreground sm:p-6">
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
    </main>
  );
};

export default Register;
