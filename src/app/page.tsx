"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Check,
  QrCode,
  CalendarCheck2,
  Users,
  BarChart3,
  BellRing,
  Rocket,
  FileText,
  UserPlus,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { LandingHeader } from "@/components/LandingHeader";

/* ─── NAV ─── */
const NAV_LINKS = [
  { href: "#features", label: "Attendance" },
  { href: "#platform", label: "Timetables" },
  { href: "#onboarding", label: "How it works" },
  { href: "#about", label: "Solutions" },
  { href: "/contact", label: "Contact Us" },
];

/* ─── FEATURE CARDS (carousel) ─── */
type FeatureCardItem = {
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
  iconClassName: string;
  featured?: boolean;
};

const FEATURE_AUTO_ADVANCE_MS = 3200;
const FEATURE_SWIPE_THRESHOLD = 56;

function getCircularOffset(index: number, activeIndex: number, total: number) {
  const rawOffset = index - activeIndex;
  return (
    ((rawOffset + total + Math.floor(total / 2)) % total) -
    Math.floor(total / 2)
  );
}

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

const FEATURE_CARDS: FeatureCardItem[] = [
  {
    title: "QR Attendance Check-In",
    description: "Allow students to check in quickly with secure class QR sessions that are easy to manage.",
    points: ["One-tap class check-in", "Fraud-resistant session codes", "Attendance history by course"],
    icon: QrCode,
    iconClassName: "bg-gray-900 text-white dark:bg-white dark:text-black",
  },
  {
    title: "Mobile Lecturer Attendance",
    description: "Lecturers can mark and confirm attendance from any device in class or on practical sessions.",
    points: ["Works on mobile and desktop", "Offline capture support", "Quick bulk confirmation"],
    icon: CalendarCheck2,
    iconClassName: "bg-gray-900 text-white dark:bg-white dark:text-black",
    featured: true,
  },
  {
    title: "Student And Lecturer Workspace",
    description: "Give both students and lecturers tailored dashboards while keeping everyone aligned in one system.",
    points: ["Role-based access", "Shared class visibility", "Clear communication channels"],
    icon: Users,
    iconClassName: "bg-gray-900 text-white dark:bg-white dark:text-black",
  },
  {
    title: "Personalized Timetable",
    description: "Build weekly class schedules automatically so students always know where to be and when.",
    points: ["Auto-synced class slots", "Course-specific view", "Easy timetable updates"],
    icon: CalendarCheck2,
    iconClassName: "bg-gray-900 text-white dark:bg-white dark:text-black",
  },
  {
    title: "Attendance Insights And Reports",
    description: "Generate meaningful reports to monitor class participation trends and identify at-risk students early.",
    points: ["Visual attendance analytics", "Downloadable reports", "Department-level summaries"],
    icon: BarChart3,
    iconClassName: "bg-gray-900 text-white dark:bg-white dark:text-black",
  },
  {
    title: "Real-Time Class Notifications",
    description: "Send instant updates about timetable changes, room swaps, and lecture reminders to everyone.",
    points: ["Lecture reminders", "Change alerts", "Announcement delivery"],
    icon: BellRing,
    iconClassName: "bg-gray-900 text-white dark:bg-white dark:text-black",
  },
];

/* ─── STATS ─── */
const STATS = [
  { value: "10K+", label: "Students onboarded" },
  { value: "500+", label: "Lecturers connected" },
  { value: "99.9%", label: "Uptime reliability" },
  { value: "4", label: "Partner institutions" },
];

/* ─── ONBOARDING STEPS ─── */
const STEPS = [
  { icon: Rocket, title: "Get Started", desc: "Click get started to begin your journey with TertiaryFree." },
  { icon: Users, title: "Choose Role", desc: "Select whether you're a student or lecturer for a tailored experience." },
  { icon: FileText, title: "Your Details", desc: "Fill in your info — institution, programme, and preferences." },
  { icon: UserPlus, title: "You're In", desc: "Your dashboard is ready with timetables, attendance, and updates." },
];

/* ─── REVIEWS ─── */
const REVIEWS = [
  {
    role: "Student • HTU",
    content: "The QR check-in has completely changed how I track attendance. No more paper sheets and long queues.",
    rating: "5.0",
  },
  {
    role: "Lecturer • Computer Science",
    content: "Managing five different classes used to be a headache. Now my timetable is auto-synced and clear.",
    rating: "5.0",
  },
  {
    role: "Student • Business",
    content: "I never miss a room swap anymore. The real-time notifications are a lifesaver for busy mornings.",
    rating: "5.0",
  },
  {
    role: "Student • Engineering",
    content: "TertiaryFree makes it so easy to keep track of my academic progress. The interface is just beautiful.",
    rating: "4.9",
  },
  {
    role: "Lecturer • Economics",
    content: "The analytics tools help me identify students who need support early in the semester. Highly recommended.",
    rating: "5.0",
  },
  {
    role: "Student • Arts",
    content: "Finally, an app that actually understands student needs. The timetable sync is flawless.",
    rating: "5.0",
  },
];

/* ─── INTERSECTION OBSERVER HOOK ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isFeaturePaused, setIsFeaturePaused] = useState(false);
  const featureSwipeStartX = useRef<number | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const reviews = useInView();
  const features = useInView();
  const platform = useInView();
  const stats = useInView();
  const onboarding = useInView();
  const about = useInView();

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (next) {
      root.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      window.localStorage.setItem("theme", "light");
    }
  };

  const goToFeature = (index: number) => {
    setActiveFeatureIndex(wrapIndex(index, FEATURE_CARDS.length));
  };
  const goToNextFeature = () => {
    setActiveFeatureIndex((prev) => wrapIndex(prev + 1, FEATURE_CARDS.length));
  };
  const goToPreviousFeature = () => {
    setActiveFeatureIndex((prev) => wrapIndex(prev - 1, FEATURE_CARDS.length));
  };
  const handleFeatureSwipeStart = (clientX: number) => {
    featureSwipeStartX.current = clientX;
  };
  const handleFeatureSwipeEnd = (clientX: number) => {
    if (featureSwipeStartX.current === null) return;
    const deltaX = clientX - featureSwipeStartX.current;
    featureSwipeStartX.current = null;
    if (Math.abs(deltaX) < FEATURE_SWIPE_THRESHOLD) return;
    if (deltaX < 0) { goToNextFeature(); return; }
    goToPreviousFeature();
  };

  useEffect(() => {
    if (isFeaturePaused) return;
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => wrapIndex(prev + 1, FEATURE_CARDS.length));
    }, FEATURE_AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isFeaturePaused]);

  useEffect(() => {
    const s = window.matchMedia("(display-mode: standalone)").matches
      || ("standalone" in window.navigator && (window.navigator as Record<string, unknown>).standalone)
      || document.referrer.includes("android-app://");
    setIsStandalone(!!s);
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  /* ─── PWA standalone splash ─── */
  if (isStandalone) {
    return (
      <div className="flex h-screen flex-col bg-white text-gray-900 transition-colors duration-500 dark:bg-black dark:text-white overflow-hidden">
        <div className="relative w-full flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-img.jpeg" alt="Welcome" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-transparent dark:via-transparent dark:to-black" />
        </div>
        <div className="flex-shrink-0 flex flex-col justify-end px-8 pb-12 -mt-10 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Tertiary<span className="text-gray-900 dark:text-white">Free</span>
            </h1>
            <p className="mt-4 text-base text-gray-600 dark:text-white/60">Your academic life, simplified.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full rounded-2xl bg-black py-4 text-center text-base font-semibold text-white dark:bg-white dark:text-black">Sign In</Link>
            <Link href="/register" className="w-full rounded-2xl border border-gray-200 py-4 text-center text-base font-semibold text-gray-900 dark:border-white/20 dark:text-white">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── MAIN LANDING ─── */
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 transition-colors duration-500 dark:bg-black dark:text-white">
      <LandingHeader
        navLinks={NAV_LINKS}
        isMenuOpen={isMenuOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleMobileMenu={() => setIsMenuOpen((p) => !p)}
        onCloseMobileMenu={() => setIsMenuOpen(false)}
      />

      {/* ══════════════ HERO — full-bleed cinematic image ══════════════ */}
      <section className="relative h-[75vh] md:h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image src="/hero-img.jpeg" alt="" fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white dark:from-transparent dark:via-black/5 dark:to-black" />
        </div>

        {/* Hero content — centered */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 max-w-5xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
            Empower Your<br />Academic Journey
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-800 dark:text-white/60 sm:text-xl">
            Personalized timetables, real-time updates, and smart notifications for students and lecturers.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-black/90 border border-black/10 p-2 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-black hover:shadow-xl dark:bg-white/95 dark:border-white/40 dark:text-black dark:hover:bg-white dark:hover:shadow-white/10"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-105 dark:bg-black dark:text-white">
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
              <span className="pr-2">Get Started</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES CAROUSEL ══════════════ */}
      <section id="features" className="relative bg-white py-32 dark:bg-black" ref={features.ref}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2563eb11,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,#1e3a5f22,transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-8">
          <div className={`text-center transition-all duration-1000 ${features.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 dark:text-white/90">
              Everything You Need
            </h2>
            <p className="mt-3 text-xl font-semibold tracking-tight text-gray-700 sm:text-3xl dark:text-white/70">
              To Manage Your Academic Life Seamlessly
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500 sm:text-lg dark:text-white/40">
              TertiaryFree brings attendance, timetable flow, lecturer tools, and class communication into one connected platform.
            </p>
          </div>

          <div
            className="relative mt-14 min-h-[540px] sm:min-h-[620px] touch-pan-y overflow-visible pt-10 select-none sm:pt-12"
            onMouseEnter={() => setIsFeaturePaused(true)}
            onMouseLeave={() => setIsFeaturePaused(false)}
            onFocusCapture={() => setIsFeaturePaused(true)}
            onBlurCapture={() => setIsFeaturePaused(false)}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              if (!touch) return;
              setIsFeaturePaused(true);
              handleFeatureSwipeStart(touch.clientX);
            }}
            onTouchEnd={(event) => {
              const touch = event.changedTouches[0];
              if (touch) handleFeatureSwipeEnd(touch.clientX);
              setIsFeaturePaused(false);
            }}
            onTouchCancel={() => { featureSwipeStartX.current = null; setIsFeaturePaused(false); }}
            onPointerDown={(event) => {
              if (event.pointerType === "mouse" && event.button !== 0) return;
              setIsFeaturePaused(true);
              handleFeatureSwipeStart(event.clientX);
            }}
            onPointerUp={(event) => { handleFeatureSwipeEnd(event.clientX); setIsFeaturePaused(false); }}
            onPointerCancel={() => { featureSwipeStartX.current = null; setIsFeaturePaused(false); }}
          >
            {/* Carousel Content */}

            {FEATURE_CARDS.map((card, index) => {
              const Icon = card.icon;
              const offset = getCircularOffset(index, activeFeatureIndex, FEATURE_CARDS.length);
              const absOffset = Math.abs(offset);
              const isVisible = absOffset <= 1;
              const scale = absOffset === 0 ? 1.1 : absOffset === 1 ? 0.86 : 0.74;
              const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.8 : 0.45;
              const zIndex = FEATURE_CARDS.length - absOffset;
              const shift = `calc(${offset} * min(18.25rem, 35vw))`;

              return (
                <article
                  key={card.title}
                  role="button"
                  tabIndex={0}
                  aria-label={`Show ${card.title}`}
                  aria-pressed={index === activeFeatureIndex}
                  onClick={() => goToFeature(index)}
                  onFocus={() => goToFeature(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); goToFeature(index); return; }
                    if (event.key === "ArrowRight") { event.preventDefault(); goToNextFeature(); return; }
                    if (event.key === "ArrowLeft") { event.preventDefault(); goToPreviousFeature(); }
                  }}
                  style={{
                    transform: `translateX(-50%) translateX(${shift}) scale(${scale})`,
                    opacity: isVisible ? opacity : 0,
                    zIndex,
                    filter: absOffset > 1 ? "saturate(85%)" : "none",
                  }}
                  className={`group absolute left-1/2 top-0 flex flex-col w-[calc(100vw-64px)] sm:w-[25.5rem] min-h-[420px] sm:min-h-[480px] overflow-hidden rounded-3xl border bg-gray-50 p-6 sm:p-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-zinc-900 ${
                    card.featured ? "border-gray-900/40 dark:border-white/40" : "border-gray-200 dark:border-white/15"
                  } ${
                    isVisible
                      ? "pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black dark:focus-visible:ring-white/20"
                      : "pointer-events-none"
                  } ${absOffset !== 0 ? "max-sm:!opacity-0 max-sm:pointer-events-none" : ""}`}
                >
                  <div className="mb-5 flex justify-center">
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${card.iconClassName}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  <h3 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 sm:text-[1.9rem] dark:text-white/90">
                    {card.title}
                  </h3>

                  <p className="mt-3 flex-grow text-base leading-7 text-gray-600 dark:text-white/50">
                    {card.description}
                  </p>

                  <ul className="mt-4 sm:mt-6 space-y-2.5">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm font-medium text-gray-700 dark:text-white/60">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2.5 rounded-full border border-gray-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur dark:border-white/15 dark:bg-white/[0.08]">
              {FEATURE_CARDS.map((card, index) => (
                <button
                  key={`feature-dot-${card.title}`}
                  onClick={() => goToFeature(index)}
                  aria-label={`Show ${card.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeFeatureIndex
                      ? "w-8 bg-black dark:bg-white"
                      : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/20 dark:hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ PLATFORM SHOWCASE ══════════════ */}
      <section id="platform" className="relative bg-gray-50 py-32 overflow-hidden dark:bg-black" ref={platform.ref}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#3b82f611,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,#0c2d6b33,transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-8">
          {/* Dashboard row */}
          <div className={`grid gap-16 lg:grid-cols-2 items-center transition-all duration-1000 ${platform.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/20">
                <Image src="/dashboard-dark.png" alt="TertiaryFree dashboard" width={800} height={500} className="w-full h-auto" />
              </div>
              {/* Decorative dashed connector */}
              <div className="absolute -right-8 top-1/2 hidden h-px w-8 border-t border-dashed border-gray-300 lg:block dark:border-white/20" />
              <div className="absolute -right-10 top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-gray-400 bg-white lg:block dark:border-white/30 dark:bg-black" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white/90">Student Dashboard</h3>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-white/50">
                The environment where students view timetables, track attendance, receive notifications, and stay aligned — all from a single, beautiful workspace.
              </p>
            </div>
          </div>

          {/* Mobile showcase row */}
          <div className={`mt-32 grid gap-16 lg:grid-cols-2 items-center transition-all duration-1000 delay-200 ${platform.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white/90">Mobile-First Experience</h3>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-white/50">
                QR attendance scanning, push notifications, and offline support — your campus tools work everywhere, on every device.
              </p>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-2xl shadow-blue-500/10 dark:border-white/10 dark:shadow-blue-900/20">
                <Image src="/mobile-showcase.png" alt="TertiaryFree mobile app" width={800} height={500} className="w-full h-auto" />
              </div>
              <div className="absolute -left-8 top-1/2 hidden h-px w-8 border-t border-dashed border-gray-300 lg:block dark:border-white/20" />
              <div className="absolute -left-10 top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-gray-400 bg-white lg:block dark:border-white/30 dark:bg-black" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <section className="relative bg-white py-20 dark:bg-black" ref={stats.ref}>
        <div className={`mx-auto max-w-5xl px-8 transition-all duration-1000 ${stats.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 text-center">
            {STATS.map((s, i) => (
              <div key={s.label} style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl dark:text-white">{s.value}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ONBOARDING ══════════════ */}
      <section id="onboarding" className="relative bg-white py-32 dark:bg-black" ref={onboarding.ref}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#3b82f611,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,#1e3a5f15,transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-8">
          <div className={`text-center transition-all duration-1000 ${onboarding.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white/90 sm:text-6xl">How it works</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-white/40">Get started in minutes, not days.</p>
          </div>

          <div className="mt-12 sm:mt-20 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`group relative rounded-3xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 flex flex-row items-start gap-5 sm:flex-col sm:items-center sm:text-center transition-all duration-700 hover:border-blue-200 dark:border-white/15 dark:bg-zinc-900 dark:hover:border-white/25 ${onboarding.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Step Number & Desktop Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black text-sm sm:text-lg font-bold text-white dark:bg-white dark:text-black transition-transform group-hover:scale-110">
                      {i + 1}
                    </div>
                    <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10">
                      <Icon className="h-8 w-8 text-gray-900 dark:text-white/80" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 pt-1 sm:pt-0">
                    <div className="flex items-center gap-2.5 mb-2 sm:hidden">
                      <Icon className="h-5 w-5 text-gray-400 dark:text-white/40" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white/90">{step.title}</h3>
                    </div>
                    <h3 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white/90">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-white/40 sm:mt-3">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ REVIEWS MARQUEE ══════════════ */}
      <section id="reviews" className="relative bg-white py-32 overflow-hidden transition-colors duration-500 dark:bg-black" ref={reviews.ref}>
        <div className={`mx-auto max-w-7xl px-8 mb-16 transition-all duration-1000 ${reviews.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Voices of Impact</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-white/40">Trusted by students and lecturers across institutions.</p>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative flex overflow-hidden py-10">
          <div className="flex animate-marquee whitespace-nowrap gap-8 hover:[animation-play-state:paused]">
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <div
                key={`${review.role}-${i}`}
                className="w-[400px] flex-shrink-0 rounded-3xl border border-black/5 bg-gray-50/50 p-8 dark:border-white/15 dark:bg-zinc-900 transition-all hover:border-black/10 dark:hover:border-white/25"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className={`h-3.5 w-3.5 ${starIdx < Math.floor(parseFloat(review.rating)) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-500/80 dark:text-amber-400/60 tracking-wider">{review.rating}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/20 mb-4">{review.role}</p>
                <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white/90 whitespace-normal">
                  &quot;{review.content}&quot;
                </p>
              </div>
            ))}
          </div>
          
          {/* Gradient Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black" />
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 2 - 2rem)); }
          }
          .animate-marquee {
            animation: marquee 50s linear infinite;
          }
        `}</style>
      </section>

      {/* ══════════════ ABOUT / CTA ══════════════ */}
      <section id="about" className="relative overflow-hidden py-32 bg-gray-50 dark:bg-black" ref={about.ref}>
        <div className="absolute inset-0 z-0">
          <Image src="/graduate-students-wearing-cap-gown.jpg" alt="" fill className="object-cover object-top opacity-[0.04] dark:opacity-25" sizes="100vw" />
          <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-black dark:via-black/80 dark:to-black/60" />
        </div>

        <div className={`relative z-10 mx-auto max-w-4xl px-8 text-center transition-all duration-1000 ${about.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Plan your semester in minutes,<br />no hidden stress
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-white/70">
            From QR attendance check-ins to timetable sync, progress reports, and class notifications — TertiaryFree keeps your academic journey clear from week one to finals.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-base font-semibold text-white transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Create Account
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <Footer />
    </div>
  );
}
