import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  title,
  subtitle,
  action,
  className,
  children,
}: CardProps) {
  return (
    <section
      className={joinClasses(
        "h-full rounded-2xl bg-white p-5 shadow-sm transition-colors duration-300 dark:bg-gray-800",
        className,
      )}
    >
      <div className="flex h-full flex-col gap-4">
        {(title || action) && (
          <header className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300">
                  {subtitle}
                </p>
              )}
            </div>
            {action}
          </header>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
