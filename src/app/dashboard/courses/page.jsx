import { CourseItem } from "@/components/student-dashboard/CourseItem";
import { WEEKLY_LECTURES } from "@/components/student-dashboard/timetable/data";
import { findCourseByCode, getDepartmentOptions } from "@/lib/local-db";

const DEFAULT_COURSE_IMAGE = "/images/course-slate-a.svg";
const DEFAULT_DEPARTMENT_NAME =
  getDepartmentOptions()[0]?.name || "Department";

function createCourseId(courseTitle, courseCode = "") {
  return `${courseTitle}-${courseCode}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCoursesFromTimetable() {
  const uniqueCourses = [];
  const seenCourses = new Set();

  for (const lecture of WEEKLY_LECTURES) {
    const title = lecture.course.trim();
    const code = lecture.code.trim();
    const key = `${title.toLowerCase()}|${code.toLowerCase()}`;

    if (!title || seenCourses.has(key)) {
      continue;
    }

    seenCourses.add(key);
    uniqueCourses.push({ title, code });
  }

  return uniqueCourses.map((course) => {
    const metadata = findCourseByCode(course.code);

    return {
      id: createCourseId(course.title, course.code),
      title: course.title,
      code: course.code,
      department: metadata?.department || DEFAULT_DEPARTMENT_NAME,
      image: metadata?.image || DEFAULT_COURSE_IMAGE,
    };
  });
}

export default function CoursesPage() {
  const courses = getCoursesFromTimetable();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="border-t-2 border-blue-600 pt-5">
          <h2 className="text-2xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
            Course overview
          </h2>

          <div className="mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-3">
              <select
                defaultValue="all"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:w-auto"
                aria-label="Filter courses"
              >
                <option value="all">All</option>
                <option value="current">Current semester</option>
                <option value="archived">Archived</option>
              </select>

              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500 sm:min-w-[220px] sm:flex-1 sm:max-w-sm"
                aria-label="Search courses"
              />

              <select
                defaultValue="name"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:w-auto"
                aria-label="Sort courses"
              >
                <option value="name">Sort by course name</option>
                <option value="code">Sort by code</option>
                <option value="department">Sort by department</option>
              </select>

              <select
                defaultValue="list"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:w-auto"
                aria-label="Toggle course view"
              >
                <option value="list">List</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white px-3 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 sm:px-4">
            {courses.map((course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
