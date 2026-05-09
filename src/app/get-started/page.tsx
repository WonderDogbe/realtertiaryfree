import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";

type RoleOption = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    title: "Student",
    description:
      "Get a personalized timetable, attendance tracking, and instant course updates.",
    href: "/register?role=student",
    icon: GraduationCap,
    iconClassName: "bg-blue-100 text-blue-700",
  },
  {
    title: "Lecturer",
    description:
      "Manage classes, mark attendance quickly, and communicate updates in real-time.",
    href: "/register?role=lecturer",
    icon: Presentation,
    iconClassName: "bg-red-100 text-red-700",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <header className="flex items-center justify-end">
          {/* Logo removed to save space */}


          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all hover:bg-blue-50"
          >
            Sign in
          </Link>
        </header>

        <section className="mx-auto mt-6 w-full max-w-5xl">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold tracking-[0.12em] text-[var(--color-primary)]">
              CREATE ACCOUNT
            </p>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl">
              ARE YOU A STUDENT OR A LECTURER?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Choose your role to continue. Both options lead to the same secure
              registration flow with fields tailored to your needs.
            </p>
          </div>

          <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;

              return (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group flex h-full min-h-[180px] flex-col rounded-2xl border border-blue-100/80 bg-[var(--color-secondary-bg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-xl hover:shadow-blue-200/70 dark:hover:shadow-none"
                >
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${option.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="mt-4 text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                    {option.title}
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                    {option.description}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold text-[var(--color-primary)]">
                    Continue as {option.title}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
