"use client";

import Link from "next/link";
import { useState } from "react";
import { cn, accentVar } from "@/lib/utils";
import { Badge, EmptyState, ProgressBar } from "@/components/ui";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InboxIcon,
} from "@/components/icons";
import { useStore } from "@/lib/storage";
import { moduleStats } from "@/lib/progress";
import type { Course, Priority } from "@/lib/schema";

const PRIORITY: Record<Priority, { label: string; tone: "primary" | "info" | "neutral" }> = {
  1: { label: "Essential", tone: "primary" },
  2: { label: "Core", tone: "info" },
  3: { label: "Extra", tone: "neutral" },
};

/** Lesson list (06 §1): collapsible modules, completion checks, priority tags,
 *  per-module progress, and a "recommended next" highlight on the next lesson. */
export function LessonList({ course }: { course: Course }) {
  const { state, hydrated } = useStore();
  const accent = accentVar(course.accentToken);
  const modules = [...course.modules].sort((a, b) => a.order - b.order);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (modules.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="text-4xl" />}
        title="No lessons yet"
        description="Lessons for this course are added in Phase 3."
      />
    );
  }

  // First not-yet-completed lesson, in module/lesson order.
  const recommendedId = hydrated
    ? modules.flatMap((m) => m.lessons).find((l) => !state.lessonsCompleted[l.id])?.id
    : undefined;

  return (
    <div className="space-y-4">
      {modules.map((module) => {
        const stats = moduleStats(state, module);
        const open = !collapsed.has(module.id);
        return (
          <section key={module.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <button
              type="button"
              onClick={() => toggle(module.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="text-fg-muted">
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-fg">{module.title}</span>
                <span className="mt-1 block">
                  <ProgressBar
                    value={stats.pct}
                    color={accent}
                    label={`${stats.completed}/${stats.total} lessons`}
                  />
                </span>
              </span>
            </button>

            {open && (
              <ul className="divide-y divide-border border-t border-border">
                {module.lessons.map((lesson) => {
                  const done = !!state.lessonsCompleted[lesson.id];
                  const recommended = lesson.id === recommendedId;
                  const prio = lesson.priority ? PRIORITY[lesson.priority] : null;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${course.id}/lessons/${lesson.id}`}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                          recommended && "bg-primary/5",
                        )}
                      >
                        <span className="mt-0.5 flex-none">
                          {done ? (
                            <CheckCircleIcon className="text-xl text-success" />
                          ) : (
                            <span className="block h-5 w-5 rounded-full border border-border-strong" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-fg">{lesson.title}</span>
                            {recommended && <Badge tone="primary">Next</Badge>}
                            {prio && <Badge tone={prio.tone}>{prio.label}</Badge>}
                          </span>
                          <span className="mt-0.5 block text-xs text-fg-muted">{lesson.summary}</span>
                          <span className="mt-1 block text-xs text-fg-faint">~{lesson.estMinutes} min</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
