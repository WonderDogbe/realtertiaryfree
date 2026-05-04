"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle: string;
  userType?: "student" | "lecturer" | "login";
  centerHeader?: boolean;
}

const ROLE_IMAGES = {
  student: "/smiley-friends-with-books-having-coffee-together-outside.jpg",
  lecturer:
    "/confident-entrepreneur-strategize-business-whiskey-luxury-social-club.jpg",
  login: "/pic.jpg",
};

export function AuthLayout({
  children,
  title,
  subtitle,
  userType = "student",
  centerHeader = false,
}: AuthLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [isMobileSystemTheme, setIsMobileSystemTheme] = useState(false);

  useEffect(() => {
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyThemePreference = () => {
      const savedTheme = window.localStorage.getItem("theme");
      const hasSavedTheme = savedTheme === "dark" || savedTheme === "light";
      const shouldFollowSystemTheme = !hasSavedTheme;
      setIsMobileSystemTheme(shouldFollowSystemTheme);

      if (shouldFollowSystemTheme) {
        setIsDarkMode(systemThemeQuery.matches);
        setIsThemeReady(true);
        return;
      }

      if (savedTheme === "dark") {
        setIsDarkMode(true);
        setIsThemeReady(true);
        return;
      }

      if (savedTheme === "light") {
        setIsDarkMode(false);
        setIsThemeReady(true);
        return;
      }

      setIsDarkMode(false);
      setIsThemeReady(true);
    };

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedTheme = window.localStorage.getItem("theme");
      const hasSavedTheme = savedTheme === "dark" || savedTheme === "light";

      if (hasSavedTheme) {
        return;
      }

      setIsDarkMode(event.matches);
    };

    applyThemePreference();
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      systemThemeQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    if (!isThemeReady) {
      return;
    }

    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }

    if (!isMobileSystemTheme) {
      window.localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode, isThemeReady, isMobileSystemTheme]);



  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Left pane - Image */}
      <div className="relative hidden w-0 flex-1 overflow-hidden bg-[var(--color-secondary-bg)] lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ROLE_IMAGES[userType]}
          alt={userType === "student" ? "Students" : "Lecturer"}
          className={`h-full w-full object-cover ${userType === "lecturer" || userType === "login" ? "scale-x-[-1]" : ""}`}
        />
      </div>

      {/* Right pane - Form Content (Previously Left) */}
      <div className="relative flex flex-1 flex-col justify-center px-5 pb-10 pt-24 sm:px-6 sm:pt-24 lg:flex-none lg:w-[500px] lg:justify-center lg:px-12 lg:py-12 xl:w-[600px] xl:px-24">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-blue-100/80 bg-white/95 backdrop-blur-md dark:border-blue-900/40 dark:bg-slate-900/95 lg:hidden">
          <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4 sm:max-w-none sm:px-6">
            <div className="origin-left scale-105">
              <Logo size="sm" />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileSystemTheme(false);
                setIsDarkMode((prev) => !prev);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 text-[var(--color-text)] transition-colors hover:bg-[var(--color-secondary-bg)] dark:border-blue-900/40"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        <div className="absolute left-5 top-20 lg:hidden sm:left-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-medium text-slate-500 transition-colors hover:text-[var(--color-primary)] dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>

        <div className="absolute left-8 top-8 hidden sm:left-12 xl:left-24 lg:block">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[var(--color-primary)]"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="mx-auto w-full max-w-md lg:w-full">
          <header className="mb-8 hidden w-full flex-col items-center lg:flex lg:mb-12">
            <Logo size="sm" className="scale-125 sm:scale-150 lg:scale-[2]" />
          </header>

          <div
            className={`animate-slide-up ${centerHeader ? "text-center" : "text-left"}`}
          >
            {title && (
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
                {title}
              </h1>
            )}
            <p
              className={`${title ? "mt-3" : "mt-2"} text-sm text-slate-500 dark:text-slate-300`}
            >
              {subtitle}
            </p>
          </div>

          <div className="mt-8 animate-slide-up delay-100 bg-transparent sm:mt-10 sm:rounded-2xl sm:border sm:border-blue-100/70 sm:bg-[var(--color-secondary-bg)] sm:p-8 sm:shadow-lg dark:border-blue-900/40">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
