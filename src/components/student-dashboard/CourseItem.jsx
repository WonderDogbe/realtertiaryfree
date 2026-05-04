import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CourseItem({ course }) {
  const titleLabel = course.code
    ? `${course.title} - (${course.code})`
    : course.title;

  const actionLabel = course.code
    ? `Open actions for ${course.code}`
    : `Open actions for ${course.title}`;

  return (
    <article className="border-b border-gray-200 px-2 py-4 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/60">
      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div className="flex min-w-0 flex-1 items-center gap-4 max-sm:w-full max-sm:items-start">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md max-sm:h-16 max-sm:w-24">
            <Image
              src={course.image}
              alt={`${course.title} thumbnail`}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <Link
              href={`/dashboard/courses?course=${course.id}`}
              className="line-clamp-2 text-lg font-medium text-blue-600 transition-colors duration-300 hover:underline dark:text-blue-300"
            >
              {titleLabel}
            </Link>
            <p className="text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400">
              {course.department}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 max-sm:self-end"
          aria-label={actionLabel}
        >
          <EllipsisVertical className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
