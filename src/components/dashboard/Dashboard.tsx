"use client";

import Link from "next/link";
import { useMemo } from "react";
import { format } from "date-fns";
import { accentVar } from "@/lib/utils";
import { Card, CountdownPill, EmptyState, Stat } from "@/components/ui";
import { CardsIcon, ClockIcon, FlameIcon, InboxIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import {
  overallReadiness,
  schedulerProgress,
  totalDueCards,
} from "@/lib/progress";
import { daysUntil, planCourse } from "@/lib/scheduler";
import type { Course } from "@/lib/schema";
import { CourseCard } from "./CourseCard";
import { TaskRow } from "./TaskRow";

export function Dashboard({ courses }: { courses: Course[] }) {
  const { state, hydrated } = useStore();
  const today = useMemo(() => (hydrated ? new Date() : null), [hydrated]);

  if (!hydrated || !today) return <DashboardSkeleton />;

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <Header date={today} readiness={0} />
        <EmptyState
          icon={<InboxIcon className="text-4xl" />}
          title="No courses loaded yet"
          description="Course content (lessons, decks, quizzes) is added course-by-course in Phase 3. Your dashboard, scheduler, and progress tracking are ready and waiting."
        />
      </div>
    );
  }

  const progress = schedulerProgress(state, courses);
  const sortedCourses = [...courses].sort(
    (a, b) => daysUntil(a.examDate, today) - daysUntil(b.examDate, today),
  );

  const groups = sortedCourses
    .map((course) => {
      const day0 = planCourse(course, progress[course.id]!, today)[0];
      return { course, tasks: day0 ? day0.tasks.filter((t) => !t.done) : [] };
    })
    .filter((g) => g.tasks.length > 0);

  const plannedMin = groups.reduce(
    (acc, g) => acc + g.tasks.reduce((a, t) => a + t.estMinutes, 0),
    0,
  );
  const dueCards = totalDueCards(state, courses, today);
  const readiness = overallReadiness(state, courses);

  return (
    <div className="space-y-8">
      <Header date={today} readiness={readiness} />

      {/* Exam countdown strip */}
      <section aria-label="Exam countdowns" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {sortedCourses.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.id}`}
            className="flex flex-none flex-col gap-1.5 rounded-2xl border border-border bg-surface px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-fg">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: accentVar(c.accentToken) }}
              />
              {c.title}
            </span>
            <CountdownPill examDate={c.examDate} accent={accentVar(c.accentToken)} now={today} />
          </Link>
        ))}
      </section>

      {/* Today's plan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Today&apos;s plan</h2>
        {groups.length === 0 ? (
          <Card>
            <p className="text-sm text-fg-muted">
              Nothing scheduled for today - you&apos;re all caught up.
            </p>
          </Card>
        ) : (
          <div className="space-y-5">
            {groups.map(({ course, tasks }) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: accentVar(course.accentToken) }}
                  />
                  <h3 className="text-sm font-medium text-fg-muted">{course.title}</h3>
                </div>
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} accent={accentVar(course.accentToken)} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Course cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Courses</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedCourses.map((c) => (
            <CourseCard key={c.id} course={c} now={today} />
          ))}
        </div>
      </section>

      {/* At-a-glance stats */}
      <section>
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <Stat
              label="Streak"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <FlameIcon className="text-xl text-warning" />
                  {state.streak.count}d
                </span>
              }
            />
            <Stat
              label="Due cards"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <CardsIcon className="text-xl text-info" />
                  {dueCards}
                </span>
              }
            />
            <Stat
              label="Planned today"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="text-xl text-primary" />
                  {plannedMin}m
                </span>
              }
            />
          </div>
        </Card>
      </section>
    </div>
  );
}

function Header({ date, readiness }: { date: Date; readiness: number }) {
  return (
    <header className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">
        {format(date, "EEEE, d MMMM yyyy")}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-fg">Study Platform</h1>
      <p className="text-sm text-fg-muted">
        Overall readiness <span className="font-semibold text-fg">{readiness}%</span> across your
        courses.
      </p>
    </header>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading dashboard">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-surface-2" />
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-surface-2" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-32 flex-none animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-44 animate-pulse rounded-2xl bg-surface" />
        <div className="h-44 animate-pulse rounded-2xl bg-surface" />
      </div>
    </div>
  );
}
