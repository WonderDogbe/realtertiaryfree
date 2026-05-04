const STATUS_STYLES = {
  Upcoming:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  Completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  Missed: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

function getStatusClassName(status) {
  return (
    STATUS_STYLES[status] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
  );
}

export function QuizTable({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-700">
        <thead>
          <tr className="text-xs uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
            <th className="px-3 py-3 font-semibold">Course</th>
            <th className="px-3 py-3 font-semibold">Quiz Title</th>
            <th className="px-3 py-3 font-semibold">Score</th>
            <th className="px-3 py-3 font-semibold">Percentage</th>
            <th className="px-3 py-3 font-semibold">Date</th>
            <th className="px-3 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((item) => (
            <tr
              key={item.id}
              className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/70"
            >
              <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100">
                {item.course}
              </td>
              <td className="px-3 py-3 text-gray-700 dark:text-gray-200">{item.title}</td>
              <td className="px-3 py-3 text-gray-700 dark:text-gray-200">{item.score}</td>
              <td className="px-3 py-3 text-gray-700 dark:text-gray-200">
                {item.percentageLabel}
              </td>
              <td className="px-3 py-3 text-gray-700 dark:text-gray-200">{item.dateLabel}</td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(item.status)}`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}