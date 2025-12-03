import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Login page component with floating pastel blobs background
 * matching Register.jsx style for consistent sanctuary feel.
 */
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

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
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Welcome back 👋");
      navigate("/chat");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Floating blobs matching Register styles for light/dark modes
  const blobs = darkMode
    ? [
        "absolute w-72 h-72 bg-purple-300/40 dark:bg-purple-800/20 rounded-full blur-3xl opacity-55 mix-blend-lighten left-[-4%] top-16",
        "absolute w-52 h-52 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50 mix-blend-lighten right-[7%] top-38",
        "absolute w-40 h-44 bg-pink-200/40 dark:bg-pink-700/15 rounded-full blur-2xl opacity-35 mix-blend-lighten left-24 bottom-20",
        "absolute w-64 h-36 bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-2xl opacity-35 mix-blend-lighten right-40 bottom-[14%]",
      ]
    : [
        "absolute w-72 h-72 bg-purple-500/80 rounded-full blur-3xl opacity-90 left-[-4%] top-16 shadow-lg",
        "absolute w-52 h-52 bg-blue-500/85 rounded-full blur-2xl opacity-85 right-[7%] top-38 shadow-lg",
        "absolute w-40 h-44 bg-pink-400/80 rounded-full blur-2xl opacity-80 left-24 bottom-20 shadow-md",
        "absolute w-64 h-36 bg-indigo-500/70 rounded-full blur-2xl opacity-75 right-40 bottom-[14%] shadow-md",
      ];

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center transition-all overflow-hidden duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-black to-gray-900"
          : "bg-gradient-to-br from-purple-300 via-blue-400 to-indigo-500"
      }`}
    >
      {/* Floating blobs, softly animated and pastel colored as emotional visual accents */}
      {blobs.map((className, i) => (
        <motion.div
          key={i}
          className={className}
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 15 + i * 2, // stagger duration a bit for gentle effect
            ease: "easeInOut",
            delay: i * 1.5,
            repeat: Infinity,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur border border-white/20 text-gray-800 dark:text-white hover:scale-110 transition-transform"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 backdrop-blur-lg glass-card p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-center text-gray-900 dark:text-white drop-shadow-lg"
        >
          Welcome to ShigoChat 🐾
        </motion.h1>

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Type, drift, connect. A sanctuary of whispers, laughter, and logic.{" "}
          <br />
        </p>

        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={`form-field ${error.email ? "border-red-500" : ""}`}
            aria-invalid={error.email ? "true" : "false"}
            aria-describedby="email-error"
          />
          {error.email && (
            <p className="text-xs text-red-500 mt-1" id="email-error">
              {error.email}
            </p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`form-field pr-10 ${
              error.password ? "border-red-500" : ""
            }`}
            aria-invalid={error.password ? "true" : "false"}
            aria-describedby="password-error"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {error.password && (
            <p className="text-xs text-red-500 mt-1" id="password-error">
              {error.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`primary-btn ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
