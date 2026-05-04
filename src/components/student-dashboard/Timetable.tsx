import { Clock3, MapPin } from "lucide-react";
import { Card } from "./Card";

export interface TimetableLecture {
  id: string;
  course: string;
  time: string;
  room: string;
  isHighlighted?: boolean;
}

interface TimetableProps {
  lectures: TimetableLecture[];
}

export function Timetable({ lectures }: TimetableProps) {
  return (
    <Card title="Today's Schedule">
      {lectures.length === 0 ? (
        <p className="text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300">
          No classes scheduled for today.
        </p>
      ) : (
        <div className="flex h-full flex-col gap-3">
          {lectures.map((lecture) => (
            <article
              key={lecture.id}
              className={`rounded-xl border p-4 transition-colors duration-300 ${
                lecture.isHighlighted
                  ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                      {lecture.course}
                    </p>
                    <p className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300">
                      <MapPin className="h-3.5 w-3.5" />
                      {lecture.room}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Clock3 className="h-3.5 w-3.5" />
                    {lecture.time}
                  </div>
                </div>

                {lecture.isHighlighted && (
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700 transition-colors duration-300 dark:text-blue-300">
                    Next Lecture
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}
