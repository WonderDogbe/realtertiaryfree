export default function ChatPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-sky-200 bg-sky-100 p-6 shadow-sm transition-colors duration-300 dark:border-sky-800/70 dark:bg-sky-900/25">
        <h2 className="text-xl font-semibold text-sky-950 transition-colors duration-300 dark:text-sky-100">
          Chat
        </h2>
        <p className="mt-2 text-sm text-sky-800 transition-colors duration-300 dark:text-sky-200/90">
          Communicate with classmates and course facilitators in one place.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-2xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          Coming soon
        </p>
        <p className="mt-3 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
          Course chat rooms and direct messages will be available here.
        </p>
      </section>
    </div>
  );
}
