"use client";

import { useEffect, useMemo, useState } from "react";

interface LiveCountdownProps {
  targetIso: string;
}

function getTimeRemaining(targetTimeMs: number, nowTimeMs: number) {
  const difference = Math.max(0, targetTimeMs - nowTimeMs);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: difference <= 0,
  };
}

export function LiveCountdown({ targetIso }: LiveCountdownProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const countdownDisplay = useMemo(() => {
    const targetTimeMs = Date.parse(targetIso);

    if (!Number.isFinite(targetTimeMs)) {
      return { status: "unavailable" } as const;
    }

    const timeRemaining = getTimeRemaining(targetTimeMs, nowMs);

    if (timeRemaining.isComplete) {
      return { status: "complete" } as const;
    }

    return {
      status: "counting",
      timeRemaining,
    } as const;
  }, [nowMs, targetIso]);

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 transition-colors duration-300 dark:text-gray-400">
        Time Until Lecture
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {countdownDisplay.status === "unavailable" && (
          <span className="text-lg font-semibold text-gray-700 transition-colors duration-300 dark:text-gray-200">
            Time unavailable
          </span>
        )}
        {countdownDisplay.status === "complete" && (
          <span className="text-2xl font-bold text-emerald-600 transition-colors duration-300 dark:text-emerald-400">
            Starting now!
          </span>
        )}
        {countdownDisplay.status === "counting" && (
          <>
            {countdownDisplay.timeRemaining.days > 0 && (
              <div className="inline-flex flex-col items-center rounded-lg bg-blue-50 px-3 py-2 transition-colors duration-300 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  {countdownDisplay.timeRemaining.days}
                </span>
                <span className="text-xs font-semibold uppercase text-blue-700/70 dark:text-blue-300/70">
                  d
                </span>
              </div>
            )}
            <div className="inline-flex flex-col items-center rounded-lg bg-purple-50 px-3 py-2 transition-colors duration-300 dark:bg-purple-900/30">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {String(countdownDisplay.timeRemaining.hours).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold uppercase text-purple-700/70 dark:text-purple-300/70">
                h
              </span>
            </div>
            <div className="inline-flex flex-col items-center rounded-lg bg-amber-50 px-3 py-2 transition-colors duration-300 dark:bg-amber-900/30">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-300">
                {String(countdownDisplay.timeRemaining.minutes).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold uppercase text-amber-700/70 dark:text-amber-300/70">
                m
              </span>
            </div>
            <div className="inline-flex flex-col items-center rounded-lg bg-rose-50 px-3 py-2 transition-colors duration-300 dark:bg-rose-900/30">
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-300">
                {String(countdownDisplay.timeRemaining.seconds).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold uppercase text-rose-700/70 dark:text-rose-300/70">
                s
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}