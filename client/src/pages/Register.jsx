import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import desktopDark from "../DesktopDarkBackgroundSplash.png";
import desktopLight from "../DesktopLightBackgroundSplash.png";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = {};
    if (!form.username.trim()) fieldErrors.username = "Username is required";
    if (!form.email.trim()) fieldErrors.email = "Email is required";
    if (!form.password.trim()) fieldErrors.password = "Password is required";

    if (Object.keys(fieldErrors).length > 0) {
      setError(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, form);
      toast.success("Account created. Redirecting...");
      setTimeout(() => navigate("/login"), 900);
    } catch {
      toast.error("Registration failed. Email or username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "sc-field px-4 py-3 text-[0.9rem]";

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
          <div className="mb-7 flex flex-col items-center">
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
              Create your space
            </h1>
            <p className="mt-1 text-[0.84rem] tracking-[0.01em] sc-text-secondary">
              Begin a quieter conversation.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ["username", "Username", "yourname", "text", "username"],
              ["email", "Email", "your@email.com", "email", "email"],
              ["password", "Password", "Password", "password", "new-password"],
            ].map(([name, label, placeholder, type, autoComplete]) => (
              <div key={name}>
                <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] sc-text-secondary">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={placeholder}
                  className={inputClass}
                  aria-invalid={error[name] ? "true" : "false"}
                  autoComplete={autoComplete}
                  style={
                    focusedField === name
                      ? { borderColor: "var(--sc-accent)", boxShadow: "0 0 0 3px var(--sc-accent-soft)" }
                      : undefined
                  }
                />
                {error[name] && <p className="mt-1 text-xs text-[#e05b7a]">{error[name]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="sc-primary-button mt-1 w-full px-4 py-3 text-[0.92rem] font-medium tracking-[0.02em]"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "var(--sc-border)" }} />
            <span className="text-[0.72rem] sc-text-muted">or</span>
            <div className="h-px flex-1" style={{ background: "var(--sc-border)" }} />
          </div>

          <p className="text-center text-[0.84rem] sc-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--sc-accent)", textDecorationColor: "var(--sc-accent-soft)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default Register;
