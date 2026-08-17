import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
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

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        darkMode,
        toggleDarkMode: () => setDarkMode((previous) => !previous),
        setTheme: (theme) => setDarkMode(theme === "dark"),
      },
    },
    children,
  );
};
