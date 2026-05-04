import { redirect } from "next/navigation";

export default function LegacyMyCoursesPage() {
  redirect("/dashboard/courses");
}
