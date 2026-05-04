import { PencilLine } from "lucide-react";
import { Card } from "../Card";

export function ProfileSettingsCard() {
  return (
    <Card title="Profile Settings" className="p-6 transition-colors duration-300 dark:bg-gray-800">
      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
            Name
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
            Sarah Konadu
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
            Email
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
            sarah.konadu@university.edu
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors duration-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <PencilLine className="h-4 w-4" />
          Edit profile
        </button>
      </div>
    </Card>
  );
}
