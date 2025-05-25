import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      toast.error("Registration failed. Email or username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-indigo-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute w-[300px] h-[300px] bg-pink-300 opacity-20 blur-3xl rounded-full top-10 left-10 animate-float z-0"></div>
      <div className="absolute w-[250px] h-[250px] bg-blue-400 opacity-20 blur-2xl rounded-full top-64 right-24 animate-float z-0"></div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur border border-white/20 text-gray-800 dark:text-white hover:scale-110 transition-transform"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Registration Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 backdrop-blur-lg glass-card p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white drop-shadow-md">
          Join ShigoChat ✨
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          A realm of voices, vibes, and virtual kinship.
        </p>

        <div>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className={`form-field ${error.username ? "border-red-500" : ""}`}
          />
          {error.username && (
            <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error.username}
            </motion.p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={`form-field ${error.email ? "border-red-500" : ""}`}
          />
          {error.email && (
            <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error.email}
            </motion.p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`form-field ${error.password ? "border-red-500" : ""}`}
          />
          {error.password && (
            <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error.password}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`primary-btn ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
