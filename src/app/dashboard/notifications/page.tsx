"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing } from "lucide-react";
import { Card } from "@/components/student-dashboard/Card";
import { NotificationsFeed } from "@/components/student-dashboard/NotificationsFeed";
import { useAuth } from "@/components/AuthProvider";
import {
  LECTURE_COMMUNICATIONS,
  OUTSTANDING_NOTIFICATIONS,
  type OutstandingNotificationItem,
} from "@/lib/dashboard-notifications";
import {
  getStudyDaysForMode,
  WEEKDAY_STUDY_DAYS,
  type WeekDayValue,
} from "@/lib/study-schedule";

const PRIORITY_BADGE_CLASSNAME: Record<OutstandingNotificationItem["priority"], string> = {
  Urgent:
    "border border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/30 dark:text-rose-300",
  Pending:
    "border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/30 dark:text-amber-300",
  Outstanding:
    "border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/30 dark:text-blue-300",
};

export default function NotificationsPage() {
  const { user: profile } = useAuth();
  const [activeDays, setActiveDays] = useState<WeekDayValue[]>(WEEKDAY_STUDY_DAYS);

  useEffect(() => {
    if (!profile || profile.role !== "student") {
      setActiveDays(WEEKDAY_STUDY_DAYS);
      return;
    }

    setActiveDays(
      getStudyDaysForMode(
        profile.studyMode || "weekday",
        profile.customStudyDays || [],
      ),
    );
  }, [profile]);

  const outstandingNotifications = useMemo(
    () => OUTSTANDING_NOTIFICATIONS.filter((item) => activeDays.includes(item.day)),
    [activeDays],
  );

  const lectureCommunications = useMemo(
    () =>
      LECTURE_COMMUNICATIONS.filter((item) => activeDays.includes(item.day)).map((item) => ({
        id: item.id,
        title: item.title,
        detail: item.detail,
        time: `${item.day} • ${item.time}`,
      })),
    [activeDays],
  );

  const urgentNotificationsCount = outstandingNotifications.filter(
    (item) => item.priority === "Urgent",
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-sky-200 bg-sky-100 p-6 shadow-sm transition-colors duration-300 dark:border-sky-800/70 dark:bg-sky-900/25">
        <h2 className="text-xl font-semibold text-sky-950 transition-colors duration-300 dark:text-sky-100">
          Notifications Center
        </h2>
        <p className="mt-2 text-sm text-sky-800 transition-colors duration-300 dark:text-sky-200/90">
          Track your current outstanding notifications and lecture communications in one place.
        </p>
      </section>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 transition-colors duration-300 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors duration-300 dark:bg-blue-900/35 dark:text-blue-200">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-500 transition-colors duration-300 dark:text-gray-300">
                Current Outstanding Notifications
              </p>
              <p className="text-3xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                {outstandingNotifications.length}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-rose-700 transition-colors duration-300 dark:border-rose-900/50 dark:bg-rose-900/30 dark:text-rose-300">
            {urgentNotificationsCount} Urgent
          </span>
        </div>

        {outstandingNotifications.length === 0 ? (
          <p className="p-5 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300">
            No outstanding notifications for your active study days.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm transition-colors duration-300 dark:divide-gray-700">
              <thead className="bg-gray-50 transition-colors duration-300 dark:bg-gray-900/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.08em] text-gray-500 transition-colors duration-300 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.08em] text-gray-500 transition-colors duration-300 dark:text-gray-300">
                    Notification
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-[0.08em] text-gray-500 transition-colors duration-300 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 transition-colors duration-300 dark:divide-gray-700">
                {outstandingNotifications.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-gray-600 transition-colors duration-300 dark:text-gray-300">
                      <p>{item.message}</p>
                      <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                        {item.source} • {item.day} • {item.updatedAt}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${PRIORITY_BADGE_CLASSNAME[item.priority]}`}
                      >
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <NotificationsFeed
        title="Lecture Communications"
        items={lectureCommunications}
      />
    </div>
  );
}