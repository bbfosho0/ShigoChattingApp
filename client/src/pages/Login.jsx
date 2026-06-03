import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import desktopDark from "../DesktopDarkBackgroundSplash.png";
import desktopLight from "../DesktopLightBackgroundSplash.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [resetLoading, setResetLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = {};
    if (!form.email.trim()) fieldErrors.email = "Email is required";
    if (!form.password.trim()) fieldErrors.password = "Password is required";

    if (Object.keys(fieldErrors).length > 0) {
      setError(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Welcome back");
      navigate("/chat");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetForm.email.trim() || !resetForm.password.trim()) {
      toast.error("Email and new password are required");
      return;
    }
    if (resetForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (resetForm.password !== resetForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setResetLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        email: resetForm.email,
        password: resetForm.password,
      });
      toast.success("Password reset. Sign in with the new password.");
      setForm({ email: resetForm.email, password: "" });
      setResetForm({ email: "", password: "", confirmPassword: "" });
      setResetOpen(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Password reset failed";
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  };

  const inputClass = (field) =>
    `sc-field px-4 py-3 text-[0.9rem] ${focusedField === field ? "ring-0" : ""}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden px-4">
      <img
        src={darkMode ? desktopDark : desktopLight}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ filter: "blur(2px)", transform: "scale(1.04)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: darkMode ? "rgba(9,13,26,0.65)" : "rgba(246,242,251,0.55)" }}
      />

      <button
        onClick={toggleDarkMode}
        className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-medium"
        style={{
          background: darkMode ? "rgba(15,22,41,0.8)" : "rgba(255,255,255,0.8)",
          color: darkMode ? "#c4b8e8" : "#7c5cbf",
          border: `1px solid ${darkMode ? "rgba(155,142,196,0.2)" : "rgba(124,92,191,0.2)"}`,
          backdropFilter: "blur(8px)",
        }}
        type="button"
      >
        {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        {darkMode ? "Light" : "Dark"}
      </button>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 24, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[1.5rem]"
        style={{
          background: darkMode ? "rgba(12,18,38,0.88)" : "rgba(255,255,255,0.88)",
          border: `1px solid ${darkMode ? "rgba(164,146,212,0.18)" : "rgba(124,92,191,0.16)"}`,
          boxShadow: darkMode
            ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(164,146,212,0.1) inset"
            : "0 32px 80px rgba(100,70,180,0.15), 0 0 0 0.5px rgba(255,255,255,0.8) inset",
          backdropFilter: "blur(32px)",
        }}
        noValidate
      >
        <div className="h-[3px] bg-gradient-to-r from-[#6b4fa8] via-[#a492d4] to-[#c4b8e8]" />

        <div className="p-8 pt-7">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-5">
              <div
                className="absolute rounded-full"
                style={{
                  background: darkMode
                    ? "radial-gradient(circle, rgba(164,146,212,0.25) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(124,92,191,0.18) 0%, transparent 70%)",
                  width: 80,
                  height: 80,
                  transform: "translate(-50%, -50%)",
                  left: "50%",
                  top: "50%",
                }}
              />
              <svg width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path d="M32 8 C18 8, 8 19, 8 32 C8 45, 18 56, 32 56 C24 50, 20 42, 20 32 C20 22, 24 14, 32 8Z" fill={darkMode ? "#c4b8e8" : "#9b78d4"} />
                <circle cx="38" cy="17" r="3.5" fill={darkMode ? "#f0eaff" : "#d4beff"} opacity="0.7" />
                <circle cx="45" cy="27" r="2" fill={darkMode ? "#f0eaff" : "#d4beff"} opacity="0.4" />
              </svg>
            </div>

            <h1 className="sc-serif text-[1.75rem] font-medium leading-tight tracking-normal sc-text-primary">
              Welcome back
            </h1>
            <p className="mt-1 text-[0.84rem] tracking-[0.01em] sc-text-secondary">
              Return to your conversations.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] sc-text-secondary">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="your@email.com"
                className={inputClass("email")}
                aria-invalid={error.email ? "true" : "false"}
                autoComplete="email"
              />
              {error.email && <p className="mt-1 text-xs text-[#e05b7a]">{error.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] sc-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Password"
                  className={`${inputClass("password")} pr-11`}
                  aria-invalid={error.password ? "true" : "false"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((current) => !current)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 p-0 sc-text-muted"
                  style={{ background: "none", border: 0, cursor: "pointer" }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {error.password && <p className="mt-1 text-xs text-[#e05b7a]">{error.password}</p>}
              <button
                type="button"
                onClick={() => {
                  setResetOpen((value) => !value);
                  setResetForm((value) => ({ ...value, email: form.email }));
                }}
                className="mt-2 text-[0.78rem] font-semibold underline underline-offset-2"
                style={{
                  background: "none",
                  border: 0,
                  color: "var(--sc-accent)",
                  cursor: "pointer",
                  padding: 0,
                  textDecorationColor: "var(--sc-accent-soft)",
                }}
              >
                Forgot password?
              </button>
            </div>

            {resetOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-3"
                style={{ background: "var(--sc-accent-glow)", border: "1px solid var(--sc-border)" }}
              >
                <p className="mb-3 text-[0.78rem] leading-relaxed sc-text-secondary">
                  Reset your password for this ShigoChat account.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    value={resetForm.email}
                    onChange={(event) => setResetForm({ ...resetForm, email: event.target.value })}
                    placeholder="Account email"
                    className="sc-field px-3 py-2 text-[0.84rem]"
                    autoComplete="email"
                  />
                  <input
                    type="password"
                    value={resetForm.password}
                    onChange={(event) => setResetForm({ ...resetForm, password: event.target.value })}
                    placeholder="New password"
                    className="sc-field px-3 py-2 text-[0.84rem]"
                    autoComplete="new-password"
                  />
                  <input
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={(event) => setResetForm({ ...resetForm, confirmPassword: event.target.value })}
                    placeholder="Confirm new password"
                    className="sc-field px-3 py-2 text-[0.84rem]"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={handleResetSubmit}
                    disabled={resetLoading}
                    className="sc-primary-button w-full px-3 py-2 text-[0.84rem] font-medium"
                  >
                    {resetLoading ? "Resetting..." : "Reset password"}
                  </button>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="sc-primary-button mt-1 w-full px-4 py-3 text-[0.92rem] font-medium tracking-[0.02em]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "var(--sc-border)" }} />
            <span className="text-[0.72rem] sc-text-muted">or</span>
            <div className="h-px flex-1" style={{ background: "var(--sc-border)" }} />
          </div>

          <p className="text-center text-[0.84rem] sc-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--sc-accent)", textDecorationColor: "var(--sc-accent-soft)" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
