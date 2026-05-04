"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface WeeklyLecture {
  id: string;
  day: WeekDay;
  course: string;
  code: string;
  lecturer: string;
  venue: string;
  startTime: string;
  endTime: string;
}

interface LectureCardProps {
  lecture: WeeklyLecture;
  className?: string;
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LectureCard({ lecture, className }: LectureCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <article
        className={joinClasses(
          "flex h-full flex-col justify-between overflow-hidden rounded-lg bg-blue-100 p-3 text-sm text-blue-900 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md dark:bg-blue-900/30 dark:text-blue-100",
          className,
        )}
      >
        <div>
          <p className="font-semibold leading-snug">{lecture.course}</p>
          <p className="mt-2 text-xs font-semibold">
            {lecture.startTime} - {lecture.endTime}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          className="mt-3 inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-blue-700 active:scale-[0.98]"
        >
          View Details
        </button>
      </article>

      {isDetailsOpen &&
        createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl transition-colors duration-300 dark:bg-gray-900">
              <h3 className="text-base font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                {lecture.course}
              </h3>
              <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
                {lecture.startTime} - {lecture.endTime}
              </p>

              <dl className="mt-4 space-y-2 text-sm text-gray-700 transition-colors duration-300 dark:text-gray-200">
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-medium">Course Code</dt>
                  <dd className="text-right">{lecture.code}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-medium">Day</dt>
                  <dd className="text-right">{lecture.day}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-medium">Lecturer</dt>
                  <dd className="text-right">{lecture.lecturer}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-medium">Venue</dt>
                  <dd className="text-right">{lecture.venue}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
