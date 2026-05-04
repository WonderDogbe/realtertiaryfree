import { BottomNav } from "@/components/student-dashboard/BottomNav";
import { DashboardShell } from "@/components/student-dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardShell>{children}</DashboardShell>
      <BottomNav />
    </>
  );
}
