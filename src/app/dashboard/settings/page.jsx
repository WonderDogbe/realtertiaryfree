import { AccountSettingsCard } from "@/components/student-dashboard/settings/AccountSettingsCard";
import { AppearanceSettingsCard } from "@/components/student-dashboard/settings/AppearanceSettingsCard";
import { NotificationPreferencesCard } from "@/components/student-dashboard/settings/NotificationPreferencesCard";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="mx-auto w-full max-w-3xl">
        <NotificationPreferencesCard />
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AppearanceSettingsCard />
        <AccountSettingsCard />
      </section>
    </div>
  );
}
