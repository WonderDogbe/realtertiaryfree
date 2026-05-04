"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MoreHorizontal, MessageSquare, CalendarDays, BookOpen, FileText, ChartNoAxesColumn, UserRound, LogOut } from "lucide-react";
import { Menu } from "@mantine/core";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { ConfirmationModal } from "./ConfirmationModal";

interface TopNavbarProps {
  title: string;
  onToggleSidebar: () => void;
  isDesktopSidebarCollapsed: boolean;
}

export function TopNavbar({
  title,
  onToggleSidebar,
  isDesktopSidebarCollapsed,
}: TopNavbarProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("Student");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if running as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as any).standalone) ||
      document.referrer.includes("android-app://");
    setIsStandaloneMode(isStandalone);

    if (user?.name) {
      setDisplayName(user.name);
    }
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  const userInitials = useMemo(() => {
    const words = displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return "ST";
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }, [displayName]);

  const handleConfirmLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  const isTimetableRoute = pathname.startsWith("/dashboard/timetable") || pathname.startsWith("/dashboard/exam-timetable");
  const isCoursesRoute = pathname.startsWith("/dashboard/courses") || pathname.startsWith("/dashboard/my-courses") || pathname.startsWith("/dashboard/quizzes") || pathname.startsWith("/dashboard/midsem");
  const isAttendanceRoute = pathname.startsWith("/dashboard/attendance");
  const isSettingsRoute = pathname.startsWith("/dashboard/settings") || pathname.startsWith("/dashboard/profile");

  const renderMobileMenuItems = () => {
    if (isTimetableRoute) {
      return (
        <>
          <Menu.Label className="py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Timetables</Menu.Label>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/timetable" leftSection={<CalendarDays className="h-4 w-4" />}>
            Class Timetable
          </Menu.Item>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/exam-timetable" leftSection={<CalendarDays className="h-4 w-4" />}>
            Exam Timetable
          </Menu.Item>
        </>
      );
    }
    if (isCoursesRoute) {
      return (
        <>
          <Menu.Label className="py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Academics</Menu.Label>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/courses" leftSection={<BookOpen className="h-4 w-4" />}>
            My Courses
          </Menu.Item>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/quizzes" leftSection={<FileText className="h-4 w-4" />}>
            Quizzes
          </Menu.Item>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/midsem" leftSection={<FileText className="h-4 w-4" />}>
            Midsem
          </Menu.Item>
        </>
      );
    }
    if (isAttendanceRoute) {
       return (
        <>
          <Menu.Label className="py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Attendance</Menu.Label>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/attendance" leftSection={<ChartNoAxesColumn className="h-4 w-4" />}>
            View Reports
          </Menu.Item>
        </>
       );
    }
    if (isSettingsRoute) {
      return (
        <>
          <Menu.Label className="py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Account</Menu.Label>
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/profile" leftSection={<UserRound className="h-4 w-4" />}>
            Profile
          </Menu.Item>
          <Menu.Divider className="border-gray-100 dark:border-gray-800" />
          <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30" onClick={() => setIsLogoutModalOpen(true)} leftSection={<LogOut className="h-4 w-4" />}>
            Sign Out
          </Menu.Item>
        </>
      );
    }
    
    // Default (Home)
    return (
      <>
        <Menu.Label className="py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Connect</Menu.Label>
        <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/chat" leftSection={<MessageSquare className="h-4 w-4" />}>
          Chats
        </Menu.Item>
        <Menu.Item className="h-9 min-h-0 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" component={Link} href="/dashboard/notifications" leftSection={<Bell className="h-4 w-4" />}>
          Notifications
        </Menu.Item>
      </>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-[#121212]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Context Menu OR Hamburger Toggle */}
            {isStandaloneMode ? (
              <Menu position="bottom-start" offset={4} withinPortal>
                <Menu.Target>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-300 dark:border-gray-700 dark:text-gray-300 md:hidden"
                    aria-label="Mobile context menu"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown className="min-w-[180px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-[#1A1A1A]">
                  {renderMobileMenuItems()}
                </Menu.Dropdown>
              </Menu>
            ) : (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-300 dark:border-gray-700 dark:text-gray-300 md:hidden"
                aria-label="Toggle mobile menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12"/>
                  <line x1="4" x2="20" y1="6" y2="6"/>
                  <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              </button>
            )}

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-300 dark:border-gray-700 dark:text-gray-300 md:inline-flex"
              aria-label="Toggle sidebar"
            >
              {isDesktopSidebarCollapsed ? (
                <MoreHorizontal className="h-4 w-4" />
              ) : (
                <span className="text-lg font-semibold leading-none">&lt;</span>
              )}
            </button>
            <h1 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:inline-flex"
              aria-label="Open student profile"
            >
              <span className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-xs font-semibold text-white transition-colors duration-300 dark:bg-gray-700">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  userInitials
                )}
              </span>
              <span className="hidden max-w-[140px] truncate sm:inline">
                {displayName}
              </span>
            </Link>
          </div>
        </div>
      </header>

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
