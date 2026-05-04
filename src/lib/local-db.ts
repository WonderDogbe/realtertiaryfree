import academicOptionsJson from "@/db/academic-options.json";
import courseCatalogJson from "@/db/course-catalog.json";
import facultyJson from "@/db/faculty.json";
import institutionsJson from "@/db/institutions.json";
import programmesJson from "@/db/programmes.json";
import weeklyLecturesJson from "@/db/weekly-lectures.json";
import {
  ALL_WEEK_DAYS,
  isKnownStudyMode as isKnownStudyModeValue,
  isKnownWeekDayValue as isKnownWeekDayValueValue,
  type StudyModeValue,
  type WeekDayValue,
} from "@/lib/study-schedule";

export interface InstitutionRecord {
  id: string;
  name: string;
  abbreviation: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type SemesterOption = SelectOption;

export interface LevelOption extends SelectOption {
  level: string;
  semester: string;
}

export interface FacultyRecord {
  id: string;
  name: string;
}

export type DepartmentRecord = FacultyRecord;

export interface ProgrammeRecord {
  id: string;
  name: string;
  facultyId: string;
  programmeType: ProgrammeTypeValue;
}

export type ProgrammeTypeValue = "degree" | "hnd";

export type UserRoleValue = "student" | "lecturer";

export interface SignupRoleOption {
  value: UserRoleValue;
  title: string;
  description: string;
}

interface AcademicOptionsPayload {
  genders: SelectOption[];
  semesters: SemesterOption[];
  levels: LevelOption[];
  signupRoles: SignupRoleOption[];
  lecturerTitles: SelectOption[];
}

export interface CourseCatalogEntry {
  id: string;
  code: string;
  title: string;
  department: string;
  image: string;
}

export interface CourseOption extends SelectOption {
  code: string;
  title: string;
}

export type GenderValue = "male" | "female" | "other";

export interface StudyModeOption extends SelectOption {
  description: string;
}

interface WeeklyLectureJsonRecord {
  id: string;
  day: string;
  courseCode: string;
  lecturer: string;
  venue: string;
  startTime: string;
  endTime: string;
}

export interface WeeklyLectureRecord {
  id: string;
  day: WeekDayValue;
  course: string;
  code: string;
  lecturer: string;
  venue: string;
  startTime: string;
  endTime: string;
}

const INSTITUTIONS = institutionsJson as InstitutionRecord[];
const ACADEMIC_OPTIONS = academicOptionsJson as AcademicOptionsPayload;
const FACULTIES = facultyJson as FacultyRecord[];
const PROGRAMMES = programmesJson as ProgrammeRecord[];
const COURSE_CATALOG = courseCatalogJson as CourseCatalogEntry[];
const WEEKLY_LECTURES_JSON = weeklyLecturesJson as WeeklyLectureJsonRecord[];

const WEEKDAY_VALUES: WeekDayValue[] = [...ALL_WEEK_DAYS];

const WEEKDAY_SET = new Set<WeekDayValue>(WEEKDAY_VALUES);
const INSTITUTION_NAMES = new Set(INSTITUTIONS.map((item) => item.name));
const GENDER_VALUES = new Set(ACADEMIC_OPTIONS.genders.map((item) => item.value));
const LEVEL_VALUES = new Set(ACADEMIC_OPTIONS.levels.map((item) => item.value));
const PROGRAMME_NAMES = new Set(PROGRAMMES.map((item) => item.name));
const PROGRAMME_TYPE_VALUES: ProgrammeTypeValue[] = ["degree", "hnd"];
const PROGRAMME_TYPE_SET = new Set<ProgrammeTypeValue>(PROGRAMME_TYPE_VALUES);
const PROGRAMME_TYPE_OPTIONS: SelectOption[] = [
  { value: "degree", label: "Bachelor Degree" },
  { value: "hnd", label: "Higher National Diploma (HND)" },
];
const STUDY_MODE_OPTIONS: StudyModeOption[] = [
  {
    value: "weekday",
    label: "Regular (Mon-Fri)",
    description: "Attend classes from Monday to Friday.",
  },
  {
    value: "weekend",
    label: "Weekend (Sat-Sun)",
    description: "Attend classes on Saturday and Sunday.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Select specific days that match your schedule.",
  },
];
const FACULTY_NAMES = new Set(FACULTIES.map((item) => item.name));
const FACULTY_BY_NAME = new Map(FACULTIES.map((item) => [item.name, item]));
const USER_ROLE_VALUES = new Set(
  ACADEMIC_OPTIONS.signupRoles.map((item) => item.value),
);
const COURSE_BY_CODE = new Map(COURSE_CATALOG.map((item) => [item.code, item]));

export function getInstitutions(): InstitutionRecord[] {
  return INSTITUTIONS;
}

export function isKnownInstitutionName(institutionName: string): boolean {
  return INSTITUTION_NAMES.has(institutionName);
}

export function findFacultyByName(facultyName: string): FacultyRecord | null {
  return FACULTY_BY_NAME.get(facultyName) || null;
}

export function findInstitutionByName(
  institutionName: string,
): InstitutionRecord | null {
  return (
    INSTITUTIONS.find((institution) => institution.name === institutionName) ||
    null
  );
}

export function getGenderOptions(): SelectOption[] {
  return ACADEMIC_OPTIONS.genders;
}

export function isKnownGender(value: unknown): value is GenderValue {
  return typeof value === "string" && GENDER_VALUES.has(value);
}

export function getSemesterOptions(): SemesterOption[] {
  return ACADEMIC_OPTIONS.semesters;
}

export function getLevelOptions(): LevelOption[] {
  return ACADEMIC_OPTIONS.levels;
}

export function isKnownLevel(value: unknown): value is string {
  return typeof value === "string" && LEVEL_VALUES.has(value);
}

export function getStudyModeOptions(): StudyModeOption[] {
  return STUDY_MODE_OPTIONS;
}

export function isKnownStudyMode(value: unknown): value is StudyModeValue {
  return isKnownStudyModeValue(value);
}

export function getWeekDayOptions(): WeekDayValue[] {
  return WEEKDAY_VALUES;
}

export function isKnownWeekDay(value: unknown): value is WeekDayValue {
  return isKnownWeekDayValueValue(value);
}

export function getSignupRoleOptions(): SignupRoleOption[] {
  return ACADEMIC_OPTIONS.signupRoles;
}

export function isKnownUserRole(value: unknown): value is UserRoleValue {
  return typeof value === "string" && USER_ROLE_VALUES.has(value as UserRoleValue);
}

export function getLecturerTitleOptions(): SelectOption[] {
  return ACADEMIC_OPTIONS.lecturerTitles;
}

export function getFacultyOptions(): FacultyRecord[] {
  return FACULTIES;
}

export function isKnownFacultyName(value: unknown): value is string {
  return typeof value === "string" && FACULTY_NAMES.has(value);
}

export function getDepartmentOptions(): DepartmentRecord[] {
  return getFacultyOptions();
}

export function isKnownDepartmentName(value: unknown): value is string {
  return isKnownFacultyName(value);
}

export function getProgrammeTypeOptions(): SelectOption[] {
  return PROGRAMME_TYPE_OPTIONS;
}

export function isKnownProgrammeType(value: unknown): value is ProgrammeTypeValue {
  return (
    typeof value === "string" &&
    PROGRAMME_TYPE_SET.has(value as ProgrammeTypeValue)
  );
}

export function getProgrammeOptions(): ProgrammeRecord[] {
  return PROGRAMMES;
}

export function getProgrammeOptionsForFacultyAndType(
  facultyName: string,
  programmeType?: ProgrammeTypeValue,
): ProgrammeRecord[] {
  const matchedFaculty = findFacultyByName(facultyName);

  if (!matchedFaculty) {
    return [];
  }

  return PROGRAMMES.filter((programme) => {
    if (programme.facultyId !== matchedFaculty.id) {
      return false;
    }

    if (programmeType && programme.programmeType !== programmeType) {
      return false;
    }

    return true;
  });
}

export function isKnownProgrammeName(value: unknown): value is string {
  return typeof value === "string" && PROGRAMME_NAMES.has(value);
}

export function getCourseCatalog(): CourseCatalogEntry[] {
  return COURSE_CATALOG;
}

export function getCourseOptions(): CourseOption[] {
  return COURSE_CATALOG.map((course) => ({
    value: course.code,
    label: `${course.title} (${course.code})`,
    code: course.code,
    title: course.title,
  }));
}

export function findCourseByCode(courseCode: string): CourseCatalogEntry | null {
  return COURSE_BY_CODE.get(courseCode) || null;
}

export function getWeeklyLectures(): WeeklyLectureRecord[] {
  const mappedLectures: WeeklyLectureRecord[] = [];

  for (const lecture of WEEKLY_LECTURES_JSON) {
    if (!WEEKDAY_SET.has(lecture.day as WeekDayValue)) {
      continue;
    }

    const courseMetadata = findCourseByCode(lecture.courseCode);

    mappedLectures.push({
      id: lecture.id,
      day: lecture.day as WeekDayValue,
      course: courseMetadata?.title || lecture.courseCode,
      code: lecture.courseCode,
      lecturer: lecture.lecturer,
      venue: lecture.venue,
      startTime: lecture.startTime,
      endTime: lecture.endTime,
    });
  }

  return mappedLectures;
}
