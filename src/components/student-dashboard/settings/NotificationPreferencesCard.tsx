"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { Card } from "../Card";

type PreferencesState = {
  lectureReminders: boolean;
  cancellationAlerts: boolean;
  announcements: boolean;
};

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
      <div>
        <p className="text-sm font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          {label}
        </p>
        <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 dark:text-gray-300">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export function NotificationPreferencesCard() {
  const [preferences, setPreferences] = useState<PreferencesState>({
    lectureReminders: true,
    cancellationAlerts: true,
    announcements: false,
  });

  return (
    <Card title="Notification Preferences" className="p-6 transition-colors duration-300 dark:bg-gray-800">
      <div className="mt-5 space-y-3">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors duration-300 dark:bg-blue-900/40 dark:text-blue-200">
          <BellRing className="h-3.5 w-3.5" />
          Alerts
        </div>

        <ToggleRow
          label="Lecture reminders"
          description="Get reminders before each scheduled lecture"
          checked={preferences.lectureReminders}
          onToggle={() =>
            setPreferences((prev) => ({
              ...prev,
              lectureReminders: !prev.lectureReminders,
            }))
          }
        />

        <ToggleRow
          label="Cancellation alerts"
          description="Receive updates when classes are canceled"
          checked={preferences.cancellationAlerts}
          onToggle={() =>
            setPreferences((prev) => ({
              ...prev,
              cancellationAlerts: !prev.cancellationAlerts,
            }))
          }
        />

        <ToggleRow
          label="Announcements"
          description="Stay informed about new department notices"
          checked={preferences.announcements}
          onToggle={() =>
            setPreferences((prev) => ({
              ...prev,
              announcements: !prev.announcements,
            }))
          }
        />
      </div>
    </Card>
  );
}
