import { LectureCard, type WeeklyLecture, type WeekDay } from "./LectureCard";

interface DayColumnProps {
  day: WeekDay;
  lectures: WeeklyLecture[];
}

export function DayColumn({ day, lectures }: DayColumnProps) {
  const orderedLectures = [...lectures].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/30">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700 transition-colors duration-300 dark:text-gray-200">
        {day}
      </h3>

      {orderedLectures.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
          No lectures scheduled.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {orderedLectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>
      )}
    </section>
  );
}
