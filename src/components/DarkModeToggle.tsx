"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("darkMode");
    return (
      stored === "true" ||
      (stored === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem("darkMode", String(newValue));
    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggle}
      className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center hover:scale-105 transition-all border border-gray-100 dark:border-gray-700"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}
