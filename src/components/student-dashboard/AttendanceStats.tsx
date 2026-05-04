import { Card } from "./Card";

export interface AttendanceCourse {
  id: string;
  course: string;
  percentage: number;
  barWidthClass: string;
}

interface AttendanceStatsProps {
  courses: AttendanceCourse[];
}

export function AttendanceStats({ courses }: AttendanceStatsProps) {
  return (
    <Card title="Attendance Stats">
      <div className="flex h-full flex-col gap-4">
        {courses.map((course) => {
          const hasGoodAttendance = course.percentage >= 50;

          return (
            <article
              key={course.id}
              className={`rounded-xl border p-3 transition-colors duration-300 ${
                hasGoodAttendance
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300">
                    {course.course}
                  </span>
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      hasGoodAttendance
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {course.percentage}%
                  </span>
                </div>
                <div
                  className={`h-2.5 rounded-full transition-colors duration-300 ${
                    hasGoodAttendance
                      ? "bg-emerald-200 dark:bg-emerald-800/60"
                      : "bg-rose-200 dark:bg-rose-800/60"
                  }`}
                >
                  <div
                    className={`h-2.5 rounded-full ${
                      hasGoodAttendance ? "bg-emerald-600" : "bg-rose-600"
                    } ${course.barWidthClass}`}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
