"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";

type NavLinkItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

type LandingHeaderProps = {
  navLinks: NavLinkItem[];
  isDarkMode?: boolean;
  isMenuOpen: boolean;
  onToggleDarkMode?: () => void;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

export function LandingHeader({
  navLinks,
  isDarkMode,
  isMenuOpen,
  onToggleDarkMode,
  onToggleMobileMenu,
  onCloseMobileMenu,
}: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─────────────── HERO-OVERLAY NAV (inside hero, transparent) ─────────────── */
  const heroNav = (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "md:pointer-events-none md:opacity-0 md:-translate-y-4 pointer-events-auto opacity-100 translate-y-0 bg-white/80 backdrop-blur-xl dark:bg-black/80" 
          : "pointer-events-auto opacity-100 translate-y-0 bg-transparent"
      }`}
    >
      <div className="relative flex w-full items-start justify-between px-6 py-4 md:px-12 md:py-10">
        {/* LEFT — logo (on mobile) / vertical nav links (desktop) */}
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="TertiaryFree home" className="md:hidden">
            <Image
              src="/logo.png"
              alt="TertiaryFree"
              width={160}
              height={44}
              priority
              className="h-7 w-auto object-contain transition-all"
            />
          </Link>
          
          <nav className="hidden md:flex flex-col gap-2.5" aria-label="Hero navigation">
            {navLinks.map((link) => (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-[13px] font-medium text-gray-900 transition-colors hover:text-black dark:text-white/75 dark:hover:text-white"
                >
                  {link.label}
                  {link.children && <ChevronDown className="h-3 w-3 opacity-60" />}
                </Link>
              </div>
            ))}
            
            <button
              onClick={onToggleDarkMode}
              className="mt-2.5 flex items-center gap-1 text-[13px] font-medium text-gray-900 transition-colors hover:text-black dark:text-white/75 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              <span className="flex items-center gap-1">
                {isDarkMode ? <Sun className="h-3 w-3 opacity-60" /> : <Moon className="h-3 w-3 opacity-60" />}
                Theme
              </span>
            </button>
          </nav>
        </div>

        {/* CENTER — logo (desktop only) — aligned with first nav link */}
        <div className="absolute left-1/2 top-10 -translate-x-1/2 hidden h-[20px] md:flex items-center justify-center pointer-events-none">
          <Link href="/" aria-label="TertiaryFree home" className="pointer-events-auto">
            <Image
              src="/logo.png"
              alt="TertiaryFree"
              width={180}
              height={49}
              priority
              className="h-8 w-auto object-contain transition-all sm:h-9"
            />
          </Link>
        </div>

        {/* RIGHT — CTA (desktop) + burger (mobile) — aligned with first nav link */}
        <div className="flex h-[20px] items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/50 px-5 py-2.5 text-sm font-semibold text-gray-900 backdrop-blur-md transition-all hover:bg-black hover:text-white dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Sign in
          </Link>

          {/* Mobile burger */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden flex flex-col items-end justify-center gap-1.5 h-10 w-8 transition-opacity hover:opacity-70"
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900 dark:text-white" />
            ) : (
              <>
                <span className="block h-0.5 w-7 rounded-full bg-gray-900 transition-all dark:bg-white" />
                <span className="block h-0.5 w-4 rounded-full bg-gray-900 transition-all dark:bg-white" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );

  /* ─────────────── SCROLLED NAV (floating pill, after hero) ─────────────── */
  const scrolledNav = (
    <header
      className={`fixed inset-x-0 top-0 z-50 hidden transition-all duration-500 md:block ${
        scrolled ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
      }`}
    >
      <div className="flex justify-center px-4 pt-4">
        <div className="flex w-full max-w-4xl items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-5 py-3 shadow-xl backdrop-blur-xl dark:bg-black/70 dark:shadow-2xl">
          {/* Logo */}
          <Link href="/" aria-label="TertiaryFree home" className="shrink-0">
            <Image
              src="/logo.png"
              alt="TertiaryFree"
              width={140}
              height={38}
              priority
              className="h-7 w-auto object-contain transition-all"
            />
          </Link>

          {/* Center links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={`scroll-${link.label}`}
                href={link.href}
                className="flex items-center gap-1 text-[13px] font-medium text-gray-700 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                {link.label}
                {link.children && <ChevronDown className="h-3 w-3 opacity-60" />}
              </Link>
            ))}

            <button
              onClick={onToggleDarkMode}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>

          {/* Right CTA + burger */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-900 backdrop-blur-sm transition-all hover:bg-black hover:text-white dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Sign in
            </Link>
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-900 transition-colors hover:bg-gray-100 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  /* ─────────────── MOBILE FULLSCREEN MENU ─────────────── */
  const mobileMenu = (
    <div
      id="mobile-navigation"
      className={`fixed inset-x-0 top-0 z-[60] flex flex-col bg-white transition-all duration-300 dark:bg-black/95 dark:backdrop-blur-xl md:hidden ${
        isMenuOpen ? "h-screen opacity-100" : "h-0 overflow-hidden opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <Image
          src="/logo.png"
          alt="TertiaryFree"
          width={160}
          height={44}
          className="h-8 w-auto dark:brightness-0 dark:invert transition-all"
        />
        <button
          onClick={onCloseMobileMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-900 dark:border-white/20 dark:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-6 pt-8">
        {navLinks.map((link) => (
          <Link
            key={`mob-${link.label}`}
            href={link.href}
            onClick={onCloseMobileMenu}
            className="text-3xl font-semibold text-gray-900/80 py-3 transition-colors hover:text-black dark:text-white/80 dark:hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-3 px-6 pb-12">
        <button
          onClick={() => {
            onToggleDarkMode?.();
            onCloseMobileMenu();
          }}
          className="flex w-full items-center justify-between rounded-2xl bg-gray-100 px-6 py-4 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <span className="text-base font-medium text-gray-700 dark:text-white/70">Theme</span>
          <div className="flex h-8 w-14 items-center rounded-full bg-gray-200 p-1 transition-colors dark:bg-white/10">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform duration-300 ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}>
              {isDarkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </div>
          </div>
        </button>

        <Link
          href="/login"
          onClick={onCloseMobileMenu}
          className="w-full rounded-full border border-gray-200 py-4 text-center text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
        >
          Sign in
        </Link>
        <Link
          href="/signup/institution?startOver=1"
          onClick={onCloseMobileMenu}
          className="w-full rounded-full bg-black py-4 text-center text-base font-semibold text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          Get Started
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {heroNav}
      {scrolledNav}
      {mobileMenu}
    </>
  );
}