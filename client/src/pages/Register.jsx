import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Register page component.
 * Uses splash screen's emotional splash-like background with floating blobs
 * for consistent theming and sanctuary feel.
 */
const Register = () => {
  // Form fields state
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  // Validation error messages keyed by field name
  const [error, setError] = useState({});
  // Loading status for async register submission
  const [loading, setLoading] = useState(false);

  // Access darkMode and toggle from global ThemeContext for theme state control
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const navigate = useNavigate();

  /**
   * Update form state on input change and clear related error.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  /**
   * Form submission handler performs client-side validation,
   * sends POST request to backend /api/auth/register endpoint,
   * displays success/error toasts, and navigates on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic presence validation for all fields
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
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      // Display generic error toast if registration fails (e.g. duplicate user)
      toast.error("Registration failed. Email or username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  // Floating blobs matching SplashScreen styles for light/dark modes
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

  // Background gradient matching SplashScreen for light/dark modes
  const backgroundClass = darkMode
    ? "bg-gradient-to-br from-black to-gray-900"
    : "bg-gradient-to-br from-purple-300 via-blue-400 to-indigo-500";

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center transition-all overflow-hidden duration-500 ${backgroundClass}`}
      aria-label="Register page with themed splash background"
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

      {/* Dark Mode Toggle Button - top-right corner, consistent styling */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur border border-white/20 text-gray-800 dark:text-white hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        type="button"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Registration Form container styled as a glassmorphic card for sanctuary feel */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 backdrop-blur-lg glass-card p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
        aria-label="Register form"
        noValidate
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white drop-shadow-md select-none">
          Join ShigoChat ✨
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm select-none">
          A realm of voices, vibes, and virtual kinship.
        </p>

        {/* Username input field with error message */}
        <div>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className={`form-field ${error.username ? "border-red-500" : ""}`}
            aria-invalid={error.username ? "true" : "false"}
            aria-describedby="username-error"
            required
            autoComplete="username"
          />
          {error.username && (
            <motion.p
              id="username-error"
              className="text-xs text-red-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
            >
              {error.username}
            </motion.p>
          )}
        </div>

        {/* Email input with validation error display */}
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
            required
            autoComplete="email"
          />
          {error.email && (
            <motion.p
              id="email-error"
              className="text-xs text-red-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
            >
              {error.email}
            </motion.p>
          )}
        </div>

        {/* Password input with validation error */}
        <div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`form-field ${error.password ? "border-red-500" : ""}`}
            aria-invalid={error.password ? "true" : "false"}
            aria-describedby="password-error"
            required
            autoComplete="new-password"
          />
          {error.password && (
            <motion.p
              id="password-error"
              className="text-xs text-red-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
            >
              {error.password}
            </motion.p>
          )}
        </div>

        {/* Submit button with loading state styling */}
        <button
          type="submit"
          disabled={loading}
          className={`primary-btn ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          aria-busy={loading ? "true" : "false"}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* Link to login page for existing users */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 select-none">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;