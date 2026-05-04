import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function FloatingBackLink({ href, label = "Go back" }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm transition-colors hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-blue-300 dark:hover:text-blue-200 sm:left-6 sm:top-6"
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}
