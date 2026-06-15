"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn, accentVar } from "@/lib/utils";
import { CountdownPill, ProgressRing } from "@/components/ui";
import { useStore } from "@/lib/storage";
import { courseReadiness } from "@/lib/progress";
import type { Course } from "@/lib/schema";
import { tabsForCourse } from "./nav-utils";

/**
 * Sticky course sub-header on every /courses/[course]/* page (04 §3): course
 * title + accent, CountdownPill, tabs row, and the course readiness ring.
 */
export function CourseSubHeader({ course }: { course: Course }) {
  const pathname = usePathname();
  const { state, hydrated } = useStore();
  const today = useMemo(() => (hydrated ? new Date() : null), [hydrated]);

  const accent = accentVar(course.accentToken);
  const tabs = tabsForCourse({ hasDrills: !!course.drills?.length || !!course.walkthroughs?.length });
  const activeTab = pathname.split("/").filter(Boolean)[2] ?? "overview";
  const readiness = hydrated ? courseReadiness(state, course) : 0;

  return (
    <div className="sticky top-14 z-20 -mx-4 border-b border-border bg-bg/90 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="min-w-0 flex-1 focus-visible:outline-none"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2.5 w-2.5 flex-none rounded-full"
                style={{ backgroundColor: accent }}
              />
              <h1 className="truncate text-lg font-semibold tracking-tight text-fg">
                {course.title}
              </h1>
            </div>
            {today && (
              <div className="mt-1">
                <CountdownPill examDate={course.examDate} accent={accent} now={today} />
              </div>
            )}
          </Link>
          <ProgressRing value={readiness} color={accent} size={52} strokeWidth={5} />
        </div>

        <nav
          aria-label="Course sections"
          className="mt-3 -mx-1 flex gap-1 overflow-x-auto pb-0.5"
        >
          {tabs.map((t) => {
            const active = activeTab === t.key;
            return (
              <Link
                key={t.key}
                href={`/courses/${course.id}/${t.key}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active ? "bg-surface-3 text-fg" : "text-fg-muted hover:text-fg hover:bg-surface-2",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
