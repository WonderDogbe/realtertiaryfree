import { Card } from "../Card";
import { ThemeToggle } from "../ThemeToggle";

export function AppearanceSettingsCard() {
  return (
    <Card title="Appearance" className="p-6 transition-colors duration-300 dark:bg-gray-800">
      <div className="mt-5 space-y-4">
        <p className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
          Choose how your dashboard looks while managing your courses.
        </p>
        <ThemeToggle label="Dark Mode" />
      </div>
    </Card>
  );
}
