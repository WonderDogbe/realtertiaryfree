"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut } from "lucide-react";
import { Card } from "../Card";
import { ConfirmationModal } from "../ConfirmationModal";
import { createClient } from "@/utils/supabase/client";

export function AccountSettingsCard() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <Card title="Account Settings" className="p-6 transition-colors duration-300 dark:bg-gray-800">
        <div className="mt-5 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="inline-flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Change password
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors duration-300 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/40"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </span>
          </button>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Sign out of your account?"
        description="You will need to sign in again to continue using your dashboard."
        confirmLabel="Sign out"
        cancelLabel={null as any}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
