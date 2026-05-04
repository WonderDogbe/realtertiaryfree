"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  CheckCircle2,
  Clock4,
  BellRing,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  formatLectureTimeRange,
  getNextLecture,
  getTodayLectures,
  getWeekDayFromDate,
} from "@/components/student-dashboard/timetable/data";
import { getStudyDaysForMode, WEEKDAY_STUDY_DAYS } from "@/lib/study-schedule";
import type { WeekDay } from "@/components/student-dashboard/timetable/LectureCard";
import { LECTURE_COMMUNICATIONS } from "@/lib/dashboard-notifications";

// ─── helpers ─────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function buildWeekDays(anchor: Date) {
  // 7-day window centred on today
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - 3 + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const ASSIGNMENTS = [
  { id: "asg-1", title: "Operating Systems Mini Project", due: "Due today at 11:59 PM", status: "Pending" as const },
  { id: "asg-2", title: "Database ERD Submission", due: "Due tomorrow at 5:00 PM", status: "Pending" as const },
  { id: "asg-3", title: "Software Engineering Reflection", due: "Submitted yesterday", status: "Submitted" as const },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3">
      <span className="text-base font-bold text-gray-900 dark:text-gray-100">{value}</span>
      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

function DatePill({
  date,
  isSelected,
  isToday,
  onClick,
}: {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2.5 transition-all duration-200 min-w-[52px]
        ${isSelected
          ? "bg-[#1a3557] text-white shadow-lg scale-105"
          : isToday
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
        {DAY_NAMES[date.getDay()]}
      </span>
      <span className="text-lg font-bold leading-none">{date.getDate()}</span>
      {isToday && !isSelected && (
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      )}
      {isSelected && (
        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
      )}
    </button>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const now = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(now);
  const [weekAnchor, setWeekAnchor] = useState(now);
  const dateStripRef = useRef<HTMLDivElement>(null);

  const [activeDays, setActiveDays] = useState<WeekDay[]>(WEEKDAY_STUDY_DAYS as WeekDay[]);

  useEffect(() => {
    if (!user || user.role !== "student") {
      setActiveDays(WEEKDAY_STUDY_DAYS as WeekDay[]);
      return;
    }
    setActiveDays(
      getStudyDaysForMode(user.studyMode || "weekday", user.customStudyDays || []) as WeekDay[]
    );
  }, [user]);

  const weekDays = useMemo(() => buildWeekDays(weekAnchor), [weekAnchor]);

  const todayWeekDay = getWeekDayFromDate(now);
  const nextLectureResult = getNextLecture(now, { activeDays });
  const selectedWeekDay = getWeekDayFromDate(selectedDate);
  const selectedDayLectures = getTodayLectures(selectedDate, { activeDays });

  const nextLectureToday =
    activeDays.includes(todayWeekDay) &&
    nextLectureResult !== null &&
    nextLectureResult.lecture.day === todayWeekDay
      ? nextLectureResult.lecture
      : null;

  const displayName = user?.name
    ? user.name.trim().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "Student";

  const firstName = displayName.split(" ")[0];

  const userInitials = (() => {
    const words = displayName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "ST";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  })();

  const avatarUrl = user?.avatarUrl ?? null;

  const totalCourses = selectedDayLectures.length || 6;
  const pendingAssignments = ASSIGNMENTS.filter((a) => a.status === "Pending").length;

  const filteredNotifications = useMemo(
    () => LECTURE_COMMUNICATIONS.filter((item) => activeDays.includes(item.day)).slice(0, 3),
    [activeDays]
  );

  return (
    <div className="space-y-5 pb-4">

      {/* ── HERO STUDENT CARD ──────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#dde9f7] via-[#e8f0fb] to-[#f0f6ff] p-5 shadow-sm dark:from-[#0f1f35] dark:via-[#0d1a2d] dark:to-[#0a1525]">
        {/* decorative circles */}
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/30 dark:bg-blue-900/20" />
        <span className="pointer-events-none absolute -bottom-8 right-16 h-28 w-28 rounded-full bg-sky-300/20 dark:bg-sky-800/20" />

        <div className="relative flex items-start justify-between gap-4">
          {/* Left — text */}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-blue-700 shadow-sm dark:bg-white/10 dark:text-blue-300">
              ⭐{" "}
              {user?.studyMode === "weekend"
                ? "Weekend Student"
                : user?.studyMode === "custom"
                  ? "Custom Student"
                  : "Regular Student"}
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              {firstName}
              <br />
              {displayName.split(" ").slice(1).join(" ")}
            </h2>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              {user?.programme || "Undergraduate"} &nbsp;·&nbsp; {user?.level ? `Level ${user.level}` : ""}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1a3557] px-4 py-1.5 text-xs font-semibold text-white shadow transition-all hover:bg-[#0f2340] dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <BookOpen className="h-3.5 w-3.5" /> View Profile
              </Link>
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white/80 px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-white dark:border-gray-600 dark:bg-white/10 dark:text-gray-300"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Chat
              </Link>
            </div>
          </div>

          {/* Right — avatar */}
          <div className="relative flex-shrink-0">
            <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-gradient-to-b from-blue-200 to-blue-400 shadow-md dark:from-blue-800 dark:to-blue-900">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Profile photo" fill className="object-cover object-top" sizes="96px" />
              ) : (
                <div className="flex h-full w-full items-end justify-center">
                  <span className="mb-2 text-3xl font-extrabold text-white/80">{userInitials}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-5 flex items-center divide-x divide-gray-200 rounded-2xl border border-white/60 bg-white/70 py-3 shadow-sm backdrop-blur dark:divide-gray-700 dark:border-white/10 dark:bg-white/5">
          <StatChip value={`${totalCourses}`} label="Courses" />
          <StatChip value={`${pendingAssignments}`} label="Pending" />
          <StatChip value={`${selectedDayLectures.length}`} label="Today" />
        </div>
      </section>

      {/* ── DATE STRIP ────────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Month nav */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const d = new Date(weekAnchor);
              d.setDate(d.getDate() - 7);
              setWeekAnchor(d);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {MONTH_NAMES[weekAnchor.getMonth()]} {weekAnchor.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => {
              const d = new Date(weekAnchor);
              d.setDate(d.getDate() + 7);
              setWeekAnchor(d);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Date pills */}
        <div ref={dateStripRef} className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
          {weekDays.map((d) => (
            <DatePill
              key={d.toISOString()}
              date={d}
              isSelected={isSameDay(d, selectedDate)}
              isToday={isSameDay(d, now)}
              onClick={() => setSelectedDate(d)}
            />
          ))}
        </div>
      </section>

      {/* ── SELECTED DAY SCHEDULE ──────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {isSameDay(selectedDate, now) ? "Today's Classes" : `Classes · ${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()}`}
          </h3>
          <Link
            href="/dashboard/timetable"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Full Timetable <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {selectedDayLectures.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CalendarDays className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No classes scheduled</p>
          </div>
        ) : (
          /* Horizontal scroll of time-slot cards, like the time picker in the ref */
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {selectedDayLectures.map((lecture) => {
              const timeStr = formatLectureTimeRange(lecture);
              const isNext = nextLectureToday?.id === lecture.id;
              return (
                <article
                  key={lecture.id}
                  className={`flex min-w-[160px] flex-col gap-2 rounded-2xl border p-3.5 transition-all duration-200 flex-shrink-0
                    ${isNext
                      ? "border-[#1a3557] bg-[#1a3557] text-white shadow-lg"
                      : "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isNext ? "text-blue-200" : "text-blue-600 dark:text-blue-400"}`}>
                    {isNext ? "Up Next" : lecture.day}
                  </span>
                  <p className="text-sm font-semibold leading-tight">{lecture.course}</p>
                  <div className={`flex items-center gap-1 text-xs ${isNext ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                    <Clock3 className="h-3 w-3" />
                    {timeStr}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${isNext ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                    <MapPin className="h-3 w-3" />
                    {lecture.venue}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── ASSIGNMENTS ────────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Assignments</h3>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {pendingAssignments} pending
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {ASSIGNMENTS.map((a) => {
            const isPending = a.status === "Pending";
            return (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                <span className={`inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${isPending ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"}`}>
                  {isPending ? <Clock4 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{a.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.due}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${isPending ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"}`}>
                  {a.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LECTURE UPDATES ────────────────────────────────────── */}
      {filteredNotifications.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Lecture Updates</h3>
            <Link href="/dashboard/notifications" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {filteredNotifications.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  <BellRing className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                </div>
                <span className="flex-shrink-0 text-[11px] text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <Link
        href="/dashboard/timetable"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a3557] py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0f2340] active:scale-[0.98] dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        <CalendarDays className="h-4 w-4" />
        View Full Timetable
      </Link>

    </div>
  );
}
