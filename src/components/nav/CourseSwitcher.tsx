"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { cn, accentVar } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/icons";
import { useIsClient } from "@/lib/storage";
import { parseRoute, type NavCourse } from "./nav-utils";

/**
 * Course switcher (04 §3): a dropdown of the courses, each with its accent dot
 * and an "exam in N days" countdown. Switching preserves the current tab.
 */
export function CourseSwitcher({ courses }: { courses: NavCourse[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { courseId, tab } = parseRoute(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Compute "today" after hydration only — avoids SSR/client date mismatch.
  const isClient = useIsClient();
  const today = useMemo(() => (isClient ? new Date() : null), [isClient]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (courses.length === 0) return null;

  const current = courses.find((c) => c.id === courseId);
  const keepTab = tab && tab !== "overview" ? tab : "";

  const go = (c: NavCourse) => {
    setOpen(false);
    router.push(keepTab ? `/courses/${c.id}/${keepTab}` : `/courses/${c.id}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface-2 px-3 text-sm font-medium text-fg transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {current ? (
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentVar(current.accentToken) }}
          />
        ) : null}
        <span className="max-w-[8rem] truncate">
          {current ? current.title : "Choose course"}
        </span>
        <ChevronDownIcon className="text-base text-fg-muted" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        >
          <ul className="max-h-[70vh] overflow-y-auto p-1">
            {courses.map((c) => {
              const days = today
                ? Math.max(0, differenceInCalendarDays(new Date(c.examDate), today))
                : null;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go(c)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2",
                      c.id === courseId && "bg-surface-2",
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 flex-none rounded-full"
                      style={{ backgroundColor: accentVar(c.accentToken) }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg">
                        {c.title}
                      </span>
                      {days != null && (
                        <span className="block text-xs text-fg-muted">
                          {days === 0 ? "Exam today" : `Exam in ${days} day${days === 1 ? "" : "s"}`}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
