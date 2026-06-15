"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/storage";
import { nearestCourseId, parseRoute, type NavCourse } from "./nav-utils";
import { CourseSwitcher } from "./CourseSwitcher";

const DESKTOP_LINKS = [
  { key: "lessons", label: "Lessons" },
  { key: "flashcards", label: "Flashcards" },
  { key: "quiz", label: "Quiz" },
  { key: "exam", label: "Exam" },
] as const;

/**
 * Slim top bar (04 §2/§3): app name + course switcher, always visible. On ≥md
 * it also exposes the course destinations as inline links (the bottom bar hides
 * there). Links target the current course, or the most-urgent one as a fallback.
 */
export function TopBar({
  courses,
  urgentCourseId,
}: {
  courses: NavCourse[];
  urgentCourseId?: string | null;
}) {
  const pathname = usePathname();
  const isClient = useIsClient();
  const { courseId, tab } = parseRoute(pathname);
  const targetCourse = courseId ?? urgentCourseId ?? (isClient ? nearestCourseId(courses) : null);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-on-primary"
          >
            ◆
          </span>
          <span className="text-sm sm:text-base">Study Platform</span>
        </Link>

        {courses.length > 0 && (
          <nav aria-label="Course sections" className="ml-auto hidden items-center gap-1 md:flex">
            {DESKTOP_LINKS.map((d) => {
              const href = targetCourse ? `/courses/${targetCourse}/${d.key}` : null;
              const active = courseId != null && tab === d.key;
              if (!href) return null;
              return (
                <Link
                  key={d.key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "bg-surface-2 text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {d.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className={cn(courses.length > 0 ? "md:ml-2" : "ml-auto")}>
          <CourseSwitcher courses={courses} />
        </div>
      </div>
    </header>
  );
}
