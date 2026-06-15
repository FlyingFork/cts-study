// Shared, serialisable nav helpers (build-docs/04). The root layout builds the
// NavCourse list from getCourses() and hands it to the client nav components.

import type { CourseId } from "@/lib/schema";

/** The minimal, serialisable course shape the nav UI needs. */
export interface NavCourse {
  id: CourseId;
  title: string;
  accentToken: string;
  examDate: string;
  hasDrills: boolean;
}

export interface RouteInfo {
  /** Course id when inside `/courses/[course]/...`, else null. */
  courseId: string | null;
  /** Active tab segment (lessons/flashcards/quiz/exam/drills) or null. */
  tab: string | null;
}

export function parseRoute(pathname: string): RouteInfo {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "courses" || !parts[1]) return { courseId: null, tab: null };
  return { courseId: parts[1], tab: parts[2] ?? "overview" };
}

export function nearestCourseId(
  courses: Pick<NavCourse, "id" | "examDate">[],
  today: Date = new Date(),
): CourseId | null {
  const dayKey = (date: Date) =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const todayKey = dayKey(today);
  const daysUntil = (examDate: string) =>
    Math.max(0, Math.round((dayKey(new Date(examDate)) - todayKey) / 86_400_000));
  return (
    [...courses].sort(
      (a, b) => daysUntil(a.examDate) - daysUntil(b.examDate),
    )[0]?.id ?? null
  );
}

export interface CourseTab {
  key: string;
  label: string;
}

const BASE_TABS: CourseTab[] = [
  { key: "lessons", label: "Lessons" },
  { key: "flashcards", label: "Flashcards" },
  { key: "quiz", label: "Quiz" },
  { key: "exam", label: "Exam" },
];

/** Tabs for a course sub-header — adds Drills only when the course has them. */
export function tabsForCourse(course: Pick<NavCourse, "hasDrills">): CourseTab[] {
  return course.hasDrills ? [...BASE_TABS, { key: "drills", label: "Drills" }] : BASE_TABS;
}

/** Bottom-tab destinations (mobile). `tab: null` = the dashboard home. */
export const BOTTOM_DESTINATIONS = [
  { key: "home", label: "Home", tab: null },
  { key: "lessons", label: "Lessons", tab: "lessons" },
  { key: "flashcards", label: "Cards", tab: "flashcards" },
  { key: "quiz", label: "Quiz", tab: "quiz" },
  { key: "exam", label: "Exam", tab: "exam" },
] as const;
