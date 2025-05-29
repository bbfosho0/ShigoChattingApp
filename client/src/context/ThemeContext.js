import React, { createContext, useState, useEffect } from "react";

    export const ThemeContext = createContext({
      darkMode: false,
      toggleDarkMode: () => {},
    });

    export const ThemeProvider = ({ children }) => {
      const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") return true;
        if (storedTheme === "light") return false;
        // Else system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      });

      useEffect(() => {
        if (darkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }, [darkMode]);

      const toggleDarkMode = () => setDarkMode((prev) => !prev);

      return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
          {children}
        </ThemeContext.Provider>
      );
    };