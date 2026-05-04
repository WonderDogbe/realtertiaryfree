"use client";

import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-200/70 bg-slate-100/60 p-6 transition-all hover:-translate-y-0.5 hover:bg-slate-100/90 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:bg-slate-800/80">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:shadow-none">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
