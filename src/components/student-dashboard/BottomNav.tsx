"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChartNoAxesColumn,
  Home,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BottomNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  activePathname: string;
  activeMatchMode?: "exact" | "prefix";
  additionalActivePathnames?: string[];
  badgeCount?: number;
};

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    id: "dashboard",
    label: "Home",
    href: "/dashboard",
    icon: Home,
    activePathname: "/dashboard",
    activeMatchMode: "exact",
  },
  {
    id: "timetable",
    label: "Timetable",
    href: "/dashboard/timetable",
    icon: CalendarDays,
    activePathname: "/dashboard/timetable",
    activeMatchMode: "prefix",
    additionalActivePathnames: ["/dashboard/exam-timetable"],
  },
  {
    id: "attendance",
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: ChartNoAxesColumn,
    activePathname: "/dashboard/attendance",
    activeMatchMode: "prefix",
  },
  {
    id: "courses",
    label: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
    activePathname: "/dashboard/courses",
    activeMatchMode: "prefix",
    additionalActivePathnames: ["/dashboard/my-courses"],
  },
  {
    id: "more",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    activePathname: "/dashboard/settings",
    activeMatchMode: "prefix",
    additionalActivePathnames: ["/dashboard/profile"],
  },
];

const matchesPath = (
  pathname: string,
  path: string,
  mode: "exact" | "prefix",
) => {
  if (mode === "exact") {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
};

function isStandalonePwaMode() {
  const isDisplayModeStandalone = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;
  const isIosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  );

  return isDisplayModeStandalone || isIosStandalone;
}

export function BottomNav() {
  const pathname = usePathname();
  const [isPwaStandalone, setIsPwaStandalone] = useState(false);

  useEffect(() => {
    const displayModeQuery = window.matchMedia("(display-mode: standalone)");

    const syncStandaloneState = () => {
      setIsPwaStandalone(isStandalonePwaMode());
    };

    syncStandaloneState();

    if (typeof displayModeQuery.addEventListener === "function") {
      displayModeQuery.addEventListener("change", syncStandaloneState);
    } else {
      displayModeQuery.addListener(syncStandaloneState);
    }

    return () => {
      if (typeof displayModeQuery.removeEventListener === "function") {
        displayModeQuery.removeEventListener("change", syncStandaloneState);
      } else {
        displayModeQuery.removeListener(syncStandaloneState);
      }
    };
  }, []);

  if (!isPwaStandalone) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 z-30 h-[5.2rem] min-h-[calc(5.2rem+env(safe-area-inset-bottom))] w-full border-t border-gray-200 bg-white shadow-md transition-colors duration-300 dark:border-gray-800 dark:bg-[#121212] md:hidden pb-safe"
      aria-label="Bottom tab navigation"
    >
      <div className="mx-auto flex h-full w-full max-w-md items-center justify-around px-1">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            matchesPath(
              pathname,
              item.activePathname,
              item.activeMatchMode ?? "exact",
            ) ||
            (item.additionalActivePathnames ?? []).some((path) =>
              matchesPath(pathname, path, "prefix"),
            );

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={`relative flex h-full flex-1 flex-col items-center justify-center gap-px text-[10px] font-medium leading-tight transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 active:text-blue-600"
              }`}
            >
              <span className="relative inline-flex items-center justify-center">
                <Icon className="h-4 w-4" />

                {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex min-w-[14px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold leading-none text-white">
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}