import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { LiveCountdown } from "./LiveCountdown";

export interface OverviewItem {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  countdownTargetIso?: string;
}

interface TodayOverviewProps {
  items: OverviewItem[];
}

export function TodayOverview({ items }: TodayOverviewProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
        Today Overview
      </h2>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isAttendanceCard = item.id === "attendance-rate";
          const shouldExpandNextLectureCard =
            item.id === "next-lecture" && items.length === 1;
          const isNextLectureCard = item.id === "next-lecture";
          const nextLectureCardClasses =
            "border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/70 shadow-[0_10px_30px_-18px_rgba(37,99,235,0.45)] dark:border-sky-900/50 dark:bg-gradient-to-br dark:from-[#171717] dark:via-[#151922] dark:to-[#10151f]";
          const attendancePercentage = Number.parseFloat(
            item.value.replace(/[^\d.]/g, ""),
          );
          const hasGoodAttendance =
            isAttendanceCard &&
            Number.isFinite(attendancePercentage) &&
            attendancePercentage >= 50;

          const attendanceCardClasses = hasGoodAttendance
            ? "border border-emerald-200 dark:border-emerald-700"
            : "border border-rose-200 dark:border-rose-700";

          const attendanceIconClasses = hasGoodAttendance
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";

          return (
            <Card
              key={item.id}
              className={[
                isAttendanceCard ? attendanceCardClasses : undefined,
                shouldExpandNextLectureCard ? "md:col-span-2 lg:col-span-3" : undefined,
                isNextLectureCard
                  ? `min-h-[240px] p-8 ${nextLectureCardClasses}`
                  : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isAttendanceCard
                        ? hasGoodAttendance
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-rose-700 dark:text-rose-300"
                        : isNextLectureCard
                          ? "text-base text-sky-700 dark:text-sky-200"
                        : "text-gray-500 dark:text-gray-300"
                    }`}
                  >
                    {item.title}
                  </p>
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 ${
                      isAttendanceCard
                        ? attendanceIconClasses
                        : isNextLectureCard
                          ? "bg-white/80 text-blue-700 ring-1 ring-blue-200/80 dark:bg-[#121212] dark:text-blue-200 dark:ring-blue-900/60"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p
                    className={`font-semibold transition-colors duration-300 ${
                      isAttendanceCard
                        ? hasGoodAttendance
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-rose-700 dark:text-rose-300"
                        : isNextLectureCard
                          ? "text-4xl leading-tight text-slate-900 dark:text-gray-100"
                        : "text-gray-900 dark:text-gray-100"
                    } ${isNextLectureCard ? "md:text-5xl" : "text-2xl"}`}
                  >
                    {item.value}
                  </p>
                  <p
                    className={`transition-colors duration-300 ${
                      isAttendanceCard
                        ? hasGoodAttendance
                          ? "text-emerald-700/90 dark:text-emerald-300/90"
                          : "text-rose-700/90 dark:text-rose-300/90"
                        : isNextLectureCard
                          ? "text-base text-slate-600 dark:text-gray-300"
                        : "text-sm text-gray-500 dark:text-gray-300"
                    }`}
                  >
                    {item.detail}
                  </p>
                  {item.countdownTargetIso && (
                    <LiveCountdown targetIso={item.countdownTargetIso} />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
