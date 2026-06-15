"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/storage";
import {
  BookIcon,
  CardsIcon,
  ClockIcon,
  HomeIcon,
  QuizIcon,
} from "@/components/icons";
import { BOTTOM_DESTINATIONS, nearestCourseId, parseRoute, type NavCourse } from "./nav-utils";

const ICONS = {
  home: HomeIcon,
  lessons: BookIcon,
  flashcards: CardsIcon,
  quiz: QuizIcon,
  exam: ClockIcon,
} as const;

/**
 * Mobile bottom tab bar — thumb-reachable, fixed, safe-area aware. Hidden ≥md
 * where the top nav takes over (04 §3). Course tabs deep-link within the
 * current course; on the dashboard they target the most-urgent course (or are
 * disabled when no content is loaded yet).
 */
export function BottomNav({
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
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-around">
        {BOTTOM_DESTINATIONS.map((dest) => {
          const Icon = ICONS[dest.key as keyof typeof ICONS];
          const isHome = dest.tab === null;
          const href = isHome
            ? "/"
            : targetCourse
              ? `/courses/${targetCourse}/${dest.tab}`
              : null;
          const active = isHome
            ? pathname === "/"
            : courseId != null && tab === dest.tab;
          const disabled = href === null;

          const inner = (
            <span
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-1.5 text-[0.65rem] font-medium transition-colors",
                active ? "text-primary" : "text-fg-muted",
                disabled && "opacity-40",
              )}
            >
              <Icon className="text-xl" />
              {dest.label}
            </span>
          );

          return (
            <li key={dest.key} className="flex-1">
              {disabled ? (
                <span aria-disabled className="block">
                  {inner}
                </span>
              ) : (
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
