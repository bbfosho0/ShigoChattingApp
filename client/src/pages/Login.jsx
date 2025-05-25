import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-300 dark:from-gray-900 dark:via-gray-800 dark:to-black overflow-hidden transition-all duration-500">
      {/* Floating Blobs */}
      <div className="absolute w-[300px] h-[300px] bg-purple-400 opacity-20 blur-3xl rounded-full animate-float top-10 left-10 z-0"></div>
      <div className="absolute w-[250px] h-[250px] bg-blue-400 opacity-20 blur-2xl rounded-full animate-float top-64 right-24 z-0"></div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur border border-white/20 text-gray-800 dark:text-white hover:scale-110 transition-transform"
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
          Type, drift, connect. A sanctuary of whispers, laughter, and logic.
        </p>

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
            <p className="text-xs text-red-500 mt-1">{error.email}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`form-field pr-10 ${error.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {error.password && (
            <p className="text-xs text-red-500 mt-1">{error.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`primary-btn ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
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
