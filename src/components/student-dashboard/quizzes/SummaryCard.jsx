export function SummaryCard({ title, value, helperText }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm transition-colors duration-300 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 transition-colors duration-300 dark:text-gray-300">
        {title}
      </p>
      <p className="mt-3 text-2xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
        {value}
      </p>
      <p className="mt-2 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
        {helperText}
      </p>
    </article>
  );
}