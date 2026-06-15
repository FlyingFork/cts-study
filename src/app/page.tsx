import { getCourses } from "@/lib/content";
import { Dashboard } from "@/components/dashboard/Dashboard";

/**
 * Home dashboard (build-docs/05): countdowns, today's adaptive plan, course
 * cards, and at-a-glance stats. This server component just hands the validated
 * course list to the client dashboard, which owns all date/localStorage logic.
 */
export default function Page() {
  return <Dashboard courses={getCourses()} />;
}
