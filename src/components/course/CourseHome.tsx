"use client";

import Link from "next/link";
import { useMemo } from "react";
import { accentVar } from "@/lib/utils";
import { Badge, Card, EmptyState } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import {
  bestExam,
  courseSchedulerProgress,
  deckMastery,
  lessonStats,
  weakTopics,
} from "@/lib/progress";
import { planCourse } from "@/lib/scheduler";
import type { Course } from "@/lib/schema";
import { TaskRow } from "@/components/dashboard/TaskRow";
import { taskMeta } from "@/components/dashboard/task-meta";

/** Course home body (04 §4): pass-line badge, today's plan for this course,
 *  progress summary, and a quick-start to the next recommended task. */
export function CourseHome({ course }: { course: Course }) {
  const { state, hydrated } = useStore();
  const today = useMemo(() => (hydrated ? new Date() : null), [hydrated]);

  if (!hydrated || !today) {
    return <div className="h-64 animate-pulse rounded-2xl bg-surface" aria-busy />;
  }

  const accent = accentVar(course.accentToken);
  const progress = courseSchedulerProgress(state, course);
  const day0 = planCourse(course, progress, today)[0];
  const todayTasks = day0 ? day0.tasks : [];
  const nextTask = todayTasks.find((t) => !t.done);

  const lessons = lessonStats(state, course);
  const mastery = deckMastery(state, course.id);
  const best = bestExam(state, course.id);
  const weak = weakTopics(state, course);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge accent={accent}>
          Pass {course.passLine}/10 · aim {course.studyTarget}
        </Badge>
        <span className="text-xs text-fg-faint">{course.examFormat}</span>
      </div>

      {nextTask && (
        <Link
          href={taskMeta(nextTask).href}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{ borderLeftColor: accent, borderLeftWidth: 2 }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">Up next</p>
            <p className="truncate text-base font-semibold text-fg">{taskMeta(nextTask).title}</p>
          </div>
          <ArrowRightIcon className="flex-none text-xl text-fg-muted" />
        </Link>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Today&apos;s plan</h2>
        {todayTasks.length === 0 ? (
          <Card>
            <p className="text-sm text-fg-muted">Nothing scheduled for today.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} accent={accent} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Progress</h2>
        <Card className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Lessons" value={`${lessons.completed}/${lessons.total}`} />
            <Metric label="Deck mastery" value={`${mastery.pct}%`} />
            <Metric
              label="Best exam"
              value={best ? `${best.score}/${best.outOf}` : "—"}
            />
          </div>
          {weak.length > 0 && (
            <p className="text-sm text-fg-muted">
              Weak topics:{" "}
              {weak.slice(0, 3).map((t, i) => (
                <span key={t} className="text-fg">
                  {i > 0 ? ", " : ""}
                  {t}
                </span>
              ))}
            </p>
          )}
        </Card>
      </section>

      {course.modules.length === 0 && (
        <EmptyState
          title="Content coming in Phase 3"
          description="Lessons, flashcards, and questions for this course haven't been loaded yet."
        />
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-2 py-2">
      <div className="text-lg font-semibold text-fg">{value}</div>
      <div className="text-[0.65rem] uppercase tracking-wide text-fg-muted">{label}</div>
    </div>
  );
}
