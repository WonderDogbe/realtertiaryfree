export const ALL_WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type WeekDayValue = (typeof ALL_WEEK_DAYS)[number];

export const WEEKDAY_STUDY_DAYS: WeekDayValue[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const WEEKEND_STUDY_DAYS: WeekDayValue[] = ["Saturday", "Sunday"];

export const STUDY_MODE_VALUES = ["weekday", "weekend", "custom"] as const;
export type StudyModeValue = (typeof STUDY_MODE_VALUES)[number];

const WEEK_DAY_SET = new Set<WeekDayValue>(ALL_WEEK_DAYS);
const STUDY_MODE_SET = new Set<StudyModeValue>(STUDY_MODE_VALUES);

export function isKnownWeekDayValue(value: unknown): value is WeekDayValue {
  return typeof value === "string" && WEEK_DAY_SET.has(value as WeekDayValue);
}

export function isKnownStudyMode(value: unknown): value is StudyModeValue {
  return (
    typeof value === "string" && STUDY_MODE_SET.has(value as StudyModeValue)
  );
}

export function normalizeCustomStudyDays(value: unknown): WeekDayValue[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const daySet = new Set<WeekDayValue>();

  for (const item of value) {
    if (isKnownWeekDayValue(item)) {
      daySet.add(item);
    }
  }

  return ALL_WEEK_DAYS.filter((day) => daySet.has(day));
}

export function getStudyDaysForMode(
  studyMode: StudyModeValue,
  customStudyDays: WeekDayValue[] = [],
): WeekDayValue[] {
  if (studyMode === "weekend") {
    return WEEKEND_STUDY_DAYS;
  }

  if (studyMode === "custom") {
    return customStudyDays.length > 0 ? customStudyDays : WEEKDAY_STUDY_DAYS;
  }

  return WEEKDAY_STUDY_DAYS;
}

export function getWeekDayFromDate(referenceDate: Date): WeekDayValue {
  const mondayBasedDayIndex = (referenceDate.getDay() + 6) % 7;
  return ALL_WEEK_DAYS[mondayBasedDayIndex];
}
