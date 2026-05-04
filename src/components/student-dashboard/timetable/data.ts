import type { WeeklyLecture, WeekDay } from "./LectureCard";
import { getWeeklyLectures } from "@/lib/local-db";
import {
  ALL_WEEK_DAYS,
  getWeekDayFromDate as getStudyWeekDayFromDate,
} from "@/lib/study-schedule";

export const WEEKLY_LECTURES: WeeklyLecture[] = getWeeklyLectures().map(
  (lecture) => ({
    ...lecture,
    day: lecture.day as WeekDay,
  }),
);

const DAY_INDEX = new Map(
  ALL_WEEK_DAYS.map((day, index) => [day, index]),
);

const MINUTES_IN_DAY = 24 * 60;

function parseTimeToMinutes(timeValue: string): number {
  const [hours, minutes] = timeValue.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return Number.NaN;
  }

  return hours * 60 + minutes;
}

function formatTo12HourClock(timeValue: string): string {
  const [rawHours, rawMinutes] = timeValue.split(":").map(Number);

  if (!Number.isFinite(rawHours) || !Number.isFinite(rawMinutes)) {
    return timeValue;
  }

  const meridiem = rawHours >= 12 ? "PM" : "AM";
  const hours = rawHours % 12 || 12;

  return `${hours}:${String(rawMinutes).padStart(2, "0")} ${meridiem}`;
}

function normalizeActiveDays(activeDays?: WeekDay[]): WeekDay[] {
  if (!activeDays || activeDays.length === 0) {
    return [...ALL_WEEK_DAYS] as WeekDay[];
  }

  const daySet = new Set(activeDays);

  return ALL_WEEK_DAYS.filter((day) => daySet.has(day as WeekDay)) as WeekDay[];
}

export interface LectureQueryOptions {
  activeDays?: WeekDay[];
}

export function getWeekDayFromDate(referenceDate: Date): WeekDay {
  return getStudyWeekDayFromDate(referenceDate) as WeekDay;
}

export function getTodayLectures(
  referenceDate = new Date(),
  options: LectureQueryOptions = {},
): WeeklyLecture[] {
  const weekday = getWeekDayFromDate(referenceDate);
  const activeDays = normalizeActiveDays(options.activeDays);

  if (!activeDays.includes(weekday)) {
    return [];
  }

  return WEEKLY_LECTURES.filter((lecture) => lecture.day === weekday).sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
}

export interface NextLectureResult {
  lecture: WeeklyLecture;
  minutesUntilStart: number;
  startAtIso: string;
}

export function getNextLecture(
  referenceDate = new Date(),
  options: LectureQueryOptions = {},
): NextLectureResult | null {
  const nowDayIndex = DAY_INDEX.get(getWeekDayFromDate(referenceDate)) || 0;
  const nowMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();
  const nowTimeMs = referenceDate.getTime();
  const activeDays = normalizeActiveDays(options.activeDays);
  const activeDaySet = new Set(activeDays);

  let closestLecture: NextLectureResult | null = null;
  let closestLectureTimeMs = Number.POSITIVE_INFINITY;

  for (const lecture of WEEKLY_LECTURES) {
    if (!activeDaySet.has(lecture.day)) {
      continue;
    }

    const lectureDayIndex = DAY_INDEX.get(lecture.day) ?? -1;
    const lectureStartMinutes = parseTimeToMinutes(lecture.startTime);

    if (!Number.isFinite(lectureStartMinutes) || lectureDayIndex < 0) {
      continue;
    }

    let dayOffset = lectureDayIndex - nowDayIndex;

    if (dayOffset < 0 || (dayOffset === 0 && lectureStartMinutes < nowMinutes)) {
      dayOffset += ALL_WEEK_DAYS.length;
    }

    const startHours = Math.floor(lectureStartMinutes / 60);
    const startMinutesRemainder = lectureStartMinutes % 60;

    const lectureStartAt = new Date(referenceDate);
    lectureStartAt.setDate(referenceDate.getDate() + dayOffset);
    lectureStartAt.setHours(startHours, startMinutesRemainder, 0, 0);

    const lectureStartAtMs = lectureStartAt.getTime();

    const minutesUntilStart =
      dayOffset * MINUTES_IN_DAY + (lectureStartMinutes - nowMinutes);

    const millisecondsUntilStart = lectureStartAtMs - nowTimeMs;

    if (
      closestLecture === null ||
      millisecondsUntilStart < closestLectureTimeMs
    ) {
      closestLecture = {
        lecture,
        minutesUntilStart,
        startAtIso: lectureStartAt.toISOString(),
      };
      closestLectureTimeMs = millisecondsUntilStart;
    }
  }

  return closestLecture;
}

export function formatLectureTimeRange(lecture: WeeklyLecture): string {
  return `${formatTo12HourClock(lecture.startTime)} - ${formatTo12HourClock(lecture.endTime)}`;
}

export function formatMinutesUntilStart(minutesUntilStart: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutesUntilStart));

  if (safeMinutes < 1) {
    return "Starting now";
  }

  if (safeMinutes < 60) {
    return `Starts in ${safeMinutes} min`;
  }

  const days = Math.floor(safeMinutes / MINUTES_IN_DAY);
  const remainingDayMinutes = safeMinutes % MINUTES_IN_DAY;
  const hours = Math.floor(remainingDayMinutes / 60);
  const minutes = remainingDayMinutes % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0 && days === 0) {
    parts.push(`${minutes}m`);
  }

  if (parts.length === 0) {
    parts.push("0m");
  }

  return `Starts in ${parts.join(" ")}`;
}
