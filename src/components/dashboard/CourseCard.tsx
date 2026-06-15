"use client";

import Link from "next/link";
import { cn, accentVar } from "@/lib/utils";
import { Badge, Card, CountdownPill, ProgressRing } from "@/components/ui";
import { useStore } from "@/lib/storage";
import {
  bestExam,
  courseReadiness,
  deckMastery,
  lessonStats,
  meetsPassLine,
  weakTopics,
} from "@/lib/progress";
import { daysUntil } from "@/lib/scheduler";
import type { Course } from "@/lib/schema";

/** Dashboard course card (05 §2.4): accent, countdown, pass-target badge,
 *  readiness ring, last exam score vs target, top weak topic, tight warning. */
export function CourseCard({ course, now }: { course: Course; now: Date }) {
  const { state } = useStore();
  const accent = accentVar(course.accentToken);

  const readiness = courseReadiness(state, course);
  const lessons = lessonStats(state, course);
  const mastery = deckMastery(state, course.id);
  const best = bestExam(state, course.id);
  const passed = meetsPassLine(state, course);
  const weak = weakTopics(state, course)[0];

  // "Tight" when remaining must-do work can't fit the days left.
  const remainingMin = course.path.tasks
    .filter((t) => !state.taskDone[t.id])
    .reduce((acc, t) => acc + t.estMinutes, 0);
  const capacity = daysUntil(course.examDate, now) * course.path.dailyBudgetMin;
  const tight = capacity > 0 && remainingMin > capacity;

  const scoreTone = best
    ? best.score >= course.studyTarget
      ? "text-success"
      : passed
        ? "text-warning"
        : "text-danger"
    : "text-fg-faint";

  return (
    <Card accent={accent} className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Link href={`/courses/${course.id}`} className="block focus-visible:outline-none">
            <h3 className="truncate text-base font-semibold text-fg">{course.title}</h3>
            {course.subtitle && (
              <p className="truncate text-xs text-fg-muted">{course.subtitle}</p>
            )}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <CountdownPill examDate={course.examDate} accent={accent} now={now} />
            <Badge accent={accent}>
              Pass {course.passLine}/10 · aim {course.studyTarget}
            </Badge>
          </div>
        </div>
        <ProgressRing value={readiness} color={accent} size={60} strokeWidth={6} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Metric label="Lessons" value={`${lessons.pct}%`} />
        <Metric label="Deck" value={`${mastery.pct}%`} />
        <Metric
          label="Best exam"
          value={best ? `${best.score}/${best.outOf}` : "—"}
          valueClassName={scoreTone}
        />
      </div>

      {tight ? (
        <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
          Tight — focus on essentials to fit the days left.
        </p>
      ) : weak ? (
        <p className="text-xs text-fg-muted">
          Weak topic: <span className="text-fg">{weak}</span>
        </p>
      ) : (
        <p className="text-xs text-fg-faint">{course.examFormat}</p>
      )}
    </Card>
  );
}

function Metric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg bg-surface-2 px-2 py-2">
      <div className={cn("text-lg font-semibold text-fg", valueClassName)}>{value}</div>
      <div className="text-[0.65rem] uppercase tracking-wide text-fg-muted">{label}</div>
    </div>
  );
}
