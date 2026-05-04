"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TimetableGrid,
} from "@/components/student-dashboard/timetable/TimetableGrid";
import { WEEKLY_LECTURES } from "@/components/student-dashboard/timetable/data";
import { useAuth } from "@/components/AuthProvider";
import {
  getStudyDaysForMode,
  WEEKDAY_STUDY_DAYS,
} from "@/lib/study-schedule";

export default function ClassTimetablePage() {
  const { user: profile } = useAuth();
  const [activeDays, setActiveDays] = useState(WEEKDAY_STUDY_DAYS);

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

  const filteredLectures = useMemo(
    () => WEEKLY_LECTURES.filter((lecture) => activeDays.includes(lecture.day)),
    [activeDays],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-sky-200 bg-sky-100 p-6 shadow-sm transition-colors duration-300 dark:border-sky-800/70 dark:bg-sky-900/25">
        <h2 className="text-xl font-semibold text-sky-950 transition-colors duration-300 dark:text-sky-100">
          Class Timetable
        </h2>
        <p className="mt-2 text-sm text-sky-800 transition-colors duration-300 dark:text-sky-200/90">
          View classes for your selected study days in one clear weekly overview.
        </p>
      </section>

      <TimetableGrid lectures={filteredLectures} days={activeDays} />
    </div>
  );
}
