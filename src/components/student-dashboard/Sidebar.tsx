"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { ConfirmationModal } from "./ConfirmationModal";

export type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  activePathname?: string;
  activeMatchMode?: "exact" | "prefix";
  group?: "timetable" | "classroom-connect" | "general";
};

interface SidebarProps {
  items: SidebarItem[];
  isDesktopCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const formatDisplayName = (name: string) =>
  name
    .trim() 
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");

function SidebarLinks({
  items,
  isCollapsed = false,
  isCompact = false,
  onNavigate,
  labelClassName,
}: {
  items: SidebarItem[];
  isCollapsed?: boolean;
  isCompact?: boolean;
  onNavigate?: () => void;
  labelClassName?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={`flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}
      aria-label="Sidebar navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.activePathname
          ? item.activeMatchMode === "prefix"
            ? pathname === item.activePathname ||
              pathname.startsWith(`${item.activePathname}/`)
            : pathname === item.activePathname
          : false;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            title={isCollapsed ? item.label : undefined}
            aria-label={isCollapsed ? item.label : undefined}
            className={`flex items-center rounded-xl ${isCompact ? "text-xs" : "text-sm"} font-medium transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            } ${
              isCollapsed
                ? "h-10 w-10 justify-center"
                : "gap-3 px-3 py-2.5 text-left"
            }`}
          >
            <Icon className="h-4 w-4" />
            {!isCollapsed && (
              <span
                className={
                  labelClassName ??
                  (item.id === "dashboard"
                    ? isCompact
                      ? "uppercase tracking-[0.06em]"
                      : "uppercase tracking-[0.08em]"
                    : "normal-case tracking-normal")
                }
              >
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  items,
  isDesktopCollapsed,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mobileProfileName, setMobileProfileName] = useState("Student");
  const [mobileProfileLevel, setMobileProfileLevel] = useState("Level not set");
  const dashboardItem = items.find((item) => item.id === "dashboard");
  const middleItems = items.filter(
    (item) => item.id !== "dashboard" && item.id !== "settings",
  );
  const timetableItems = middleItems.filter((item) => item.group === "timetable");
  const classroomConnectItems = middleItems.filter(
    (item) => item.group === "classroom-connect",
  );
  const generalItems = middleItems.filter(
    (item) => item.group !== "timetable" && item.group !== "classroom-connect",
  );
  const settingsItem = items.find((item) => item.id === "settings");

  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.name) {
      setMobileProfileName(formatDisplayName(user.name));
    }

    const rawLevel = user?.level?.trim();

    if (rawLevel) {
      const levelLabel =
        rawLevel.toLowerCase().startsWith("level")
          ? rawLevel
          : `Level ${rawLevel}`;
      setMobileProfileLevel(formatDisplayName(levelLabel));
    }
  }, [user]);

  const handleConfirmLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
    onCloseMobile();
    router.push("/login");
  };
  const isMobileProfileActive =
    pathname === "/dashboard/profile" || pathname.startsWith("/dashboard/profile/");

  return (
    <>
      <aside
        className={`hidden flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex dark:border-gray-800 dark:bg-[#121212] ${
          isDesktopCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div
          className={`flex h-16 items-center transition-all duration-300 ease-in-out ${
            isDesktopCollapsed ? "justify-center px-3" : "px-6"
          }`}
        >
          {isDesktopCollapsed ? (
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white"
              aria-label="TertiaryFree"
            >
              TF
            </span>
          ) : (
            <div className="flex items-center">
              <Logo size="sm" className="origin-left" />
            </div>
          )}
        </div>

        <div
          className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
            isDesktopCollapsed ? "p-3" : "p-6"
          }`}
        >
          {dashboardItem && (
            <SidebarLinks
              items={[dashboardItem]}
              isCollapsed={isDesktopCollapsed}
            />
          )}

          {middleItems.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-800">
              {timetableItems.length > 0 && (
                <div>
                  {!isDesktopCollapsed && (
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
                      Timetables
                    </p>
                  )}
                  <div className={isDesktopCollapsed ? "mt-0" : "mt-2"}>
                    <SidebarLinks
                      items={timetableItems}
                      isCollapsed={isDesktopCollapsed}
                    />
                  </div>
                </div>
              )}

              {classroomConnectItems.length > 0 && (
                <div
                  className={
                    timetableItems.length > 0
                      ? "mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-800"
                      : undefined
                  }
                >
                  {!isDesktopCollapsed && (
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
                      Classroom
                    </p>
                  )}
                  <div className={isDesktopCollapsed ? "mt-0" : "mt-2"}>
                    <SidebarLinks
                      items={classroomConnectItems}
                      isCollapsed={isDesktopCollapsed}
                    />
                  </div>
                </div>
              )}

              {generalItems.length > 0 && (
                <div
                  className={
                    timetableItems.length > 0 || classroomConnectItems.length > 0
                      ? "mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-800"
                      : undefined
                  }
                >
                  <SidebarLinks
                    items={generalItems}
                    isCollapsed={isDesktopCollapsed}
                  />
                </div>
              )}
            </div>
          )}

          {settingsItem && (
            <div className="mt-auto pt-4">
              <SidebarLinks
                items={[settingsItem]}
                isCollapsed={isDesktopCollapsed}
              />
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                title={isDesktopCollapsed ? "Sign out" : undefined}
                aria-label={isDesktopCollapsed ? "Sign out" : undefined}
                className={`mt-2 flex items-center rounded-xl text-sm font-medium text-rose-600 transition-all duration-300 ease-in-out hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/30 ${
                  isDesktopCollapsed
                    ? "h-10 w-10 justify-center"
                    : "gap-3 px-3 py-2.5 text-left"
                }`}
              >
                <LogOut className="h-4 w-4" />
                {!isDesktopCollapsed && (
                  <span className="tracking-normal">Sign Out</span>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:hidden dark:border-gray-800 dark:bg-[#121212] ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile sidebar"
      >
        <div className="flex h-16 items-center px-4 transition-colors duration-300">
          <div className="flex items-center">
            <Logo size="sm" className="origin-left" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 overflow-y-auto">
          {dashboardItem && (
            <SidebarLinks
              items={[dashboardItem]}
              onNavigate={onCloseMobile}
              isCompact
            />
          )}

          {middleItems.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-800">
              {timetableItems.length > 0 && (
                <div>
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
                    Timetables
                  </p>
                  <div className="mt-2">
                    <SidebarLinks
                      items={timetableItems}
                      onNavigate={onCloseMobile}
                      isCompact
                    />
                  </div>
                </div>
              )}

              {classroomConnectItems.length > 0 && (
                <div
                  className={
                    timetableItems.length > 0
                      ? "mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-800"
                      : undefined
                  }
                >
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
                    Classroom
                  </p>
                  <div className="mt-2">
                    <SidebarLinks
                      items={classroomConnectItems}
                      onNavigate={onCloseMobile}
                      isCompact
                    />
                  </div>
                </div>
              )}

              {generalItems.length > 0 && (
                <div
                  className={
                    timetableItems.length > 0 || classroomConnectItems.length > 0
                      ? "mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-800"
                      : undefined
                  }
                >
                  <SidebarLinks
                    items={generalItems}
                    onNavigate={onCloseMobile}
                    isCompact
                  />
                </div>
              )}
            </div>
          )}

          {settingsItem && (
            <div className="mt-auto pt-4">
              <SidebarLinks
                items={[settingsItem]}
                onNavigate={onCloseMobile}
                isCompact
              />
              <Link
                href="/dashboard/profile"
                onClick={onCloseMobile}
                className={`mt-2 flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ease-in-out ${
                  isMobileProfileActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <UserRound className="mt-0.5 h-4 w-4" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-medium normal-case tracking-normal">
                    {mobileProfileName}
                  </span>
                  <span
                    className={`truncate text-[11px] ${
                      isMobileProfileActive
                        ? "text-blue-700/80 dark:text-blue-200/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {mobileProfileLevel}
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Sign out of your account?"
        description="You will need to sign in again to continue using your dashboard."
        confirmLabel="Sign out"
        cancelLabel={null as any}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
