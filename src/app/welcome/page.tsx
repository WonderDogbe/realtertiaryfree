"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[]; role?: string | string[] }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const email = resolvedSearchParams?.email ?? "";
  const [firstName, setFirstName] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user?.name) {
      setFirstName(user.name.split(" ")[0]);
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] bg-gray-50 transition-colors duration-300 dark:bg-[#121212] p-6 selection:bg-[var(--color-accent)] selection:text-white">
      <div className="max-w-md w-full animate-slide-up rounded-[2.5rem] bg-white p-10 text-center shadow-2xl dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800">
        <div className="mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Welcome Aboard{firstName ? `, ${firstName}` : ""}!
        </h1>
        
        <p className="mb-10 text-[1.05rem] text-slate-600 dark:text-slate-300 leading-relaxed">
          Your account has been successfully created. We are incredibly excited to help you simplify your academic life with TertiaryFree!
        </p>
        
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-[1.05rem] font-semibold text-white shadow-xl transition-transform active:scale-[0.98] hover:bg-blue-700"
          >
            Continue to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
