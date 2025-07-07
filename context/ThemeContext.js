
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();


export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system"); // 'light', 'dark', or 'system'
  const [resolvedTheme, setResolvedTheme] = useState("light");

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme") || localStorage.getItem("theme") === "system") {
        setResolvedTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // On mount, set theme from localStorage or system
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
      setResolvedTheme(storedTheme);
    } else {
      setTheme("system");
      setResolvedTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, []);

  // Apply theme to body
  useEffect(() => {
    const applied = theme === "system" ? resolvedTheme : theme;
    if (applied === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme, resolvedTheme]);

  const setThemeMode = (mode) => {
    if (mode === "system") {
      setTheme("system");
      setResolvedTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      localStorage.setItem("theme", "system");
    } else {
      setTheme(mode);
      setResolvedTheme(mode);
      localStorage.setItem("theme", mode);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") {
        setResolvedTheme("dark");
        localStorage.setItem("theme", "dark");
        return "dark";
      }
      if (prev === "dark") {
        setResolvedTheme("light");
        localStorage.setItem("theme", "light");
        return "light";
      }
      // If system, toggle to dark
      setResolvedTheme("dark");
      localStorage.setItem("theme", "dark");
      return "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
