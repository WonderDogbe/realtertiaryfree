import { SummaryCard } from "@/components/student-dashboard/quizzes/SummaryCard";

export const dynamic = "force-dynamic";

const MIDSEMS = [
  {
    id: "midsem-1",
    course: "CSC 321",
    title: "Software Engineering Midsem",
    date: "2026-05-08",
    time: "09:00",
    venue: "Room A-11",
    score: null,
    status: "Upcoming",
  },
  {
    id: "midsem-2",
    course: "MAT 311",
    title: "Numerical Methods Midsem",
    date: "2026-05-12",
    time: "14:00",
    venue: "Room C-08",
    score: null,
    status: "Upcoming",
  },
  {
    id: "midsem-3",
    course: "ECO 201",
    title: "Microeconomics Midsem",
    date: "2026-04-04",
    time: "10:00",
    venue: "Online (LMS)",
    score: "34/40",
    status: "Completed",
  },
  {
    id: "midsem-4",
    course: "PHY 205",
    title: "Electromagnetism Midsem",
    date: "2026-03-21",
    time: "08:30",
    venue: "Room B-02",
    score: "0/30",
    status: "Missed",
  },
];

const STATUS_STYLES = {
  Upcoming:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  Ongoing:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  Completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  Missed: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

const UPCOMING_STATUSES = new Set(["Upcoming", "Ongoing"]);
const HISTORY_STATUSES = new Set(["Completed", "Missed"]);

function getStatusClassName(status) {
  return (
    STATUS_STYLES[status] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
  );
}

function parseScore(score) {
  if (!score || !score.includes("/")) {
    return null;
  }

  const [earnedRaw, totalRaw] = score.split("/");
  const earned = Number(earnedRaw);
  const total = Number(totalRaw);

  if (!Number.isFinite(earned) || !Number.isFinite(total) || total <= 0) {
    return null;
  }

  return {
    earned,
    total,
    percentage: (earned / total) * 100,
  };
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatTime(time24Hour) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`1970-01-01T${time24Hour}:00`));
}

function formatCountdown(dateTime, now) {
  const diffMs = dateTime.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Live now";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export default function MidsemPage() {
  const now = new Date();

  const midsems = MIDSEMS.map((midsem) => {
    const scoreData = parseScore(midsem.score);
    const dateTime = new Date(`${midsem.date}T${midsem.time}:00`);

    return {
      ...midsem,
      dateTime,
      dateLabel: formatDate(midsem.date),
      timeLabel: formatTime(midsem.time),
      percentage: scoreData ? Math.round(scoreData.percentage) : null,
      percentageLabel: scoreData ? `${Math.round(scoreData.percentage)}%` : "--",
    };
  }).sort((leftMidsem, rightMidsem) => leftMidsem.dateTime - rightMidsem.dateTime);

  const upcomingMidsems = midsems.filter((midsem) => UPCOMING_STATUSES.has(midsem.status));
  const historyMidsems = midsems
    .filter((midsem) => HISTORY_STATUSES.has(midsem.status))
    .sort((leftMidsem, rightMidsem) => rightMidsem.dateTime - leftMidsem.dateTime);

  const scoredMidsems = historyMidsems.filter((midsem) => midsem.percentage !== null);
  const averageScore =
    scoredMidsems.length > 0
      ? `${Math.round(
          scoredMidsems.reduce(
            (runningTotal, midsem) => runningTotal + (midsem.percentage ?? 0),
            0,
          ) / scoredMidsems.length,
        )}%`
      : "--";

  const nextUpcomingMidsem = upcomingMidsems.find(
    (midsem) => midsem.dateTime.getTime() > now.getTime(),
  );

  const summaryCards = [
    {
      id: "total-midsems",
      title: "Total Midsems",
      value: String(midsems.length),
      helperText: "All listed midsem assessments",
    },
    {
      id: "upcoming-midsems",
      title: "Upcoming Midsems",
      value: String(upcomingMidsems.length),
      helperText: "Scheduled and currently running midsems",
    },
    {
      id: "next-midsem",
      title: "Next Midsem Countdown",
      value: nextUpcomingMidsem
        ? formatCountdown(nextUpcomingMidsem.dateTime, now)
        : "No upcoming midsem",
      helperText: nextUpcomingMidsem
        ? `${nextUpcomingMidsem.course} - ${nextUpcomingMidsem.title}`
        : "All listed midsems are completed",
    },
    {
      id: "midsem-average",
      title: "Average Midsem Score",
      value: averageScore,
      helperText: "Based on completed midsem results",
    },
  ];

  return (
    <div className="space-y-8 px-4 sm:px-0">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          Midsem
        </h1>
        <p className="mt-2 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
          View upcoming midsems and review your past midsem performance.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            value={card.value}
            helperText={card.helperText}
          />
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          Upcoming Midsems
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {upcomingMidsems.length > 0 ? (
            upcomingMidsems.map((midsem) => (
              <article
                key={midsem.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
                      {midsem.course}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                      {midsem.title}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(midsem.status)}`}
                  >
                    {midsem.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 transition-colors duration-300 dark:text-gray-200">
                  {midsem.dateLabel} at {midsem.timeLabel}
                </p>
                <p className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
                  Venue: <span className="font-medium">{midsem.venue}</span>
                </p>
              </article>
            ))
          ) : (
            <article className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              No upcoming midsems right now.
            </article>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          Midsem History
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-white p-5 shadow-sm transition-colors duration-300 dark:bg-gray-800">
          {historyMidsems.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-700">
              <thead>
                <tr className="text-xs uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
                  <th className="px-3 py-3 font-semibold">Course</th>
                  <th className="px-3 py-3 font-semibold">Midsem Title</th>
                  <th className="px-3 py-3 font-semibold">Score</th>
                  <th className="px-3 py-3 font-semibold">Percentage</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {historyMidsems.map((midsem) => (
                  <tr
                    key={midsem.id}
                    className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  >
                    <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {midsem.course}
                    </td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-200">{midsem.title}</td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-200">{midsem.score}</td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-200">
                      {midsem.percentageLabel}
                    </td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-200">
                      {midsem.dateLabel}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(midsem.status)}`}
                      >
                        {midsem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
              Completed midsems will appear here once results are published.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}