import { DayColumn } from "./DayColumn";
import { LectureCard, type WeeklyLecture, type WeekDay } from "./LectureCard";
import { ALL_WEEK_DAYS } from "@/lib/study-schedule";

const DEFAULT_WEEK_DAYS: WeekDay[] = [...ALL_WEEK_DAYS] as WeekDay[];

const TIME_LABELS = [
  "07:00",
  "09:00",
  "11:00",
  "13:00",
  "15:00",
  "17:00",
  "19:00",
  "21:00",
];

const SLOT_MINUTES = 120;

function parseTimeToMinutes(timeValue: string) {
  const [hours, minutes] = timeValue.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return Number.NaN;
  }

  return hours * 60 + minutes;
}

const GRID_START_MINUTES = parseTimeToMinutes(TIME_LABELS[0]);
const GRID_MAX_MINUTES = GRID_START_MINUTES + TIME_LABELS.length * SLOT_MINUTES;

function getGridPlacement(lecture: WeeklyLecture, visibleDays: WeekDay[]) {
  const dayIndex = visibleDays.indexOf(lecture.day);
  if (dayIndex < 0) {
    return null;
  }

  const startMinutes = parseTimeToMinutes(lecture.startTime);
  const endMinutes = parseTimeToMinutes(lecture.endTime);

  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) {
    return null;
  }

  const clampedStart = Math.max(
    GRID_START_MINUTES,
    Math.min(startMinutes, GRID_MAX_MINUTES - SLOT_MINUTES),
  );
  const clampedEnd = Math.min(
    GRID_MAX_MINUTES,
    Math.max(clampedStart + 30, endMinutes),
  );

  const rawColumnStart =
    Math.floor((clampedStart - GRID_START_MINUTES) / SLOT_MINUTES) + 2;
  const rawColumnEnd =
    Math.ceil((clampedEnd - GRID_START_MINUTES) / SLOT_MINUTES) + 2;

  const maxColumnStart = TIME_LABELS.length + 1;
  const maxColumnEnd = TIME_LABELS.length + 2;

  const columnStart = Math.min(Math.max(rawColumnStart, 2), maxColumnStart);
  const columnEnd = Math.min(
    Math.max(rawColumnEnd, columnStart + 1),
    maxColumnEnd,
  );

  const rowStart = dayIndex + 2;

  return {
    columnStart,
    columnEnd,
    rowStart,
  };
}

interface TimetableGridProps {
  lectures: WeeklyLecture[];
  days?: WeekDay[];
}

export function TimetableGrid({ lectures, days }: TimetableGridProps) {
  const visibleDays =
    days && days.length > 0
      ? (ALL_WEEK_DAYS.filter((day) => days.includes(day as WeekDay)) as WeekDay[])
      : DEFAULT_WEEK_DAYS;

  const filteredLectures = lectures.filter((lecture) =>
    visibleDays.includes(lecture.day),
  );

  return (
    <section className="space-y-4">
      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[1380px] rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/30">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `170px repeat(${TIME_LABELS.length}, minmax(140px, 1fr))`,
              gridTemplateRows: `auto repeat(${visibleDays.length}, minmax(132px, 1fr))`,
            }}
          >
            <div className="rounded-lg bg-gray-200 p-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-700 transition-colors duration-300 dark:bg-gray-800 dark:text-gray-200">
              Day
            </div>

            {TIME_LABELS.map((time) => (
              <div
                key={`time-header-${time}`}
                className="rounded-lg bg-gray-200 p-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-700 transition-colors duration-300 dark:bg-gray-800 dark:text-gray-200"
              >
                {time}
              </div>
            ))}

            {visibleDays.map((day, rowIndex) => (
              <div
                key={`day-label-${day}`}
                className="rounded-lg bg-gray-200 px-2 py-3 text-xs font-medium text-gray-700 transition-colors duration-300 dark:bg-gray-800 dark:text-gray-200"
                style={{ gridColumnStart: 1, gridRowStart: rowIndex + 2 }}
              >
                {day}
              </div>
            ))}

            {visibleDays.map((day, rowIndex) =>
              TIME_LABELS.map((time, columnIndex) => (
                <div
                  key={`cell-${day}-${time}`}
                  className="rounded-lg border border-gray-200 bg-white/90 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/45"
                  style={{
                    gridColumnStart: columnIndex + 2,
                    gridRowStart: rowIndex + 2,
                  }}
                />
              )),
            )}

            {filteredLectures.map((lecture) => {
              const placement = getGridPlacement(lecture, visibleDays);

              if (!placement) {
                return null;
              }

              return (
                <div
                  key={lecture.id}
                  className="z-10"
                  style={{
                    gridColumnStart: placement.columnStart,
                    gridColumnEnd: placement.columnEnd,
                    gridRowStart: placement.rowStart,
                  }}
                >
                  <LectureCard lecture={lecture} className="h-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {visibleDays.map((day) => (
          <DayColumn
            key={`mobile-${day}`}
            day={day}
            lectures={filteredLectures.filter((lecture) => lecture.day === day)}
          />
        ))}
      </div>
    </section>
  );
}
