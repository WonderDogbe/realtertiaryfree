import { BellRing } from "lucide-react";
import { Card } from "./Card";

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

interface NotificationsFeedProps {
  items: NotificationItem[];
  title?: string;
}

export function NotificationsFeed({
  items,
  title = "Notifications Feed",
}: NotificationsFeedProps) {
  return (
    <Card title={title}>
      <div className="flex h-full min-h-0 flex-col">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300">
            No lecture updates available right now.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition-colors duration-300 dark:bg-blue-900/40 dark:text-blue-200">
                      <BellRing className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
