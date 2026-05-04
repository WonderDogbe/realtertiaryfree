"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "light" | "dark";

function getInitialThemeMode(): ThemeMode {
  const savedTheme = window.localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(mode);
  window.localStorage.setItem("theme", mode);
}

interface ThemeToggleProps {
  label?: string;
  className?: string;
}

export function ThemeToggle({
  label = "Dark Mode",
  className = "",
}: ThemeToggleProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialThemeMode = getInitialThemeMode();
    setThemeMode(initialThemeMode);
    applyThemeMode(initialThemeMode);
    setIsReady(true);
  }, []);

  const isDarkMode = themeMode === "dark";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800 transition-colors duration-300 dark:text-gray-100">
        {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <span>{label}</span>
      </div>

      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={isDarkMode}
        disabled={!isReady}
        onClick={() => {
          const nextThemeMode: ThemeMode = isDarkMode ? "light" : "dark";
          setThemeMode(nextThemeMode);
          applyThemeMode(nextThemeMode);
        }}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
          isDarkMode ? "bg-blue-600" : "bg-gray-300"
        } ${!isReady ? "cursor-not-allowed opacity-70" : ""}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
            isDarkMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
