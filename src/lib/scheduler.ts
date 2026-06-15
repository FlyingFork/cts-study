// Phase 2 (build-docs/05-dashboard-and-scheduler.md): exam-date → day-plan engine.
//
// Pure functions, no UI. Every input is data — nothing about specific calendar
// dates is hardcoded, so re-planning on each load automatically re-compresses
// the remaining days when the learner falls behind.

import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import type { Course, CourseId, PathTask, TopicTag } from "@/lib/schema";

/** Calendar days from `today` until `examDate` (min 0). */
export function daysUntil(examDate: string, today: Date = new Date()): number {
  return Math.max(0, differenceInCalendarDays(parseISO(examDate), today));
}

/** A path task placed on a concrete day. */
export interface ScheduledTask extends PathTask {
  courseId: CourseId;
  dayIndex: number; // 0 = today
  date: string; // ISO date (yyyy-MM-dd)
  done: boolean;
}

export interface DayPlan {
  date: string;
  dayIndex: number;
  tasks: ScheduledTask[];
  totalMinutes: number;
}

/** What the scheduler needs to know about a learner's progress in one course. */
export interface CourseProgress {
  /** PathTask ids already completed (explicitly or via the underlying activity). */
  completedTaskIds: string[];
  /** Weakest topics first — used to target the final-day review. */
  weakTopics: TopicTag[];
}

/** Per-course progress keyed by course id. */
export type Progress = Partial<Record<CourseId, CourseProgress>>;

const isoDay = (date: Date): string => format(date, "yyyy-MM-dd");

const EXAM_SIM_RESERVE_MIN = 30;
const REVIEW_RESERVE_MIN = 20;

/** The exam-sim task reserved for the final day (synthesised from the manifest). */
function examSimTask(course: Course): PathTask {
  return {
    id: `${course.id}-task-exam-sim`,
    kind: "exam-sim",
    ref: course.examSim.id,
    estMinutes: course.examSim.timeLimitMin || EXAM_SIM_RESERVE_MIN,
    priority: 1,
  };
}

/** The weak-topic review task reserved for the final day. */
function reviewTask(course: Course, weakTopics: TopicTag[]): PathTask {
  const topic = weakTopics[0] ?? course.topicTags[0];
  return {
    id: `${course.id}-task-review`,
    kind: "review",
    ref: topic ?? `${course.id}-review`,
    topic,
    estMinutes: REVIEW_RESERVE_MIN,
    priority: 1,
  };
}

function schedule(
  task: PathTask,
  courseId: CourseId,
  dayIndex: number,
  today: Date,
  done: boolean,
): ScheduledTask {
  return {
    ...task,
    courseId,
    dayIndex,
    date: isoDay(addDays(today, dayIndex)),
    done,
  };
}

function sumMinutes(tasks: PathTask[]): number {
  return tasks.reduce((acc, t) => acc + t.estMinutes, 0);
}

/**
 * Build the whole remaining plan for one course, one entry per remaining day.
 * The final day is always reserved for an exam-sim + a weak-topic review.
 */
export function planCourse(
  course: Course,
  progress: CourseProgress,
  today: Date = new Date(),
): DayPlan[] {
  const done = new Set(progress.completedTaskIds);
  const D = daysUntil(course.examDate, today);
  const budget = course.path.dailyBudgetMin;
  const exam = examSimTask(course);
  const review = reviewTask(course, progress.weakTopics);

  // Exam day (or already past): only the exam-sim + a final weak-topic review.
  if (D === 0) {
    const tasks = [
      schedule(exam, course.id, 0, today, done.has(exam.id)),
      schedule(review, course.id, 0, today, done.has(review.id)),
    ];
    return [{ date: isoDay(today), dayIndex: 0, tasks, totalMinutes: sumMinutes(tasks) }];
  }

  // Surviving learning tasks: drop completed ones and any authored exam-sim
  // (we always reserve our own on the final day).
  let tasks = course.path.tasks.filter(
    (t) => t.kind !== "exam-sim" && !done.has(t.id),
  );

  // Shed load by priority when the remaining work can't fit the capacity,
  // but never drop a mustFinishBeforeExam task.
  const must = new Set(course.path.mustFinishBeforeExam);
  const capacity = D * budget;
  for (const level of [3, 2] as const) {
    if (sumMinutes(tasks) <= capacity) break;
    for (let i = tasks.length - 1; i >= 0 && sumMinutes(tasks) > capacity; i--) {
      if (tasks[i].priority === level && !must.has(tasks[i].id)) {
        tasks = tasks.filter((_, idx) => idx !== i);
      }
    }
  }

  // Distribute surviving tasks greedily across days 0..D-1, preserving order so
  // prerequisites precede dependents. The final day is the exam reserve.
  const dayTasks: ScheduledTask[][] = Array.from({ length: D }, () => []);
  const dayMinutes: number[] = Array.from({ length: D }, () => 0);
  const lastLearningDay = D > 1 ? D - 2 : 0;

  let day = 0;
  for (const task of tasks) {
    while (day < lastLearningDay && dayMinutes[day] + task.estMinutes > budget) {
      day++;
    }
    dayTasks[day].push(schedule(task, course.id, day, today, false));
    dayMinutes[day] += task.estMinutes;
  }

  // Reserve the final day for the exam-sim + weak-topic review.
  const examDay = D - 1;
  dayTasks[examDay].push(
    schedule(exam, course.id, examDay, today, done.has(exam.id)),
    schedule(review, course.id, examDay, today, done.has(review.id)),
  );
  dayMinutes[examDay] += exam.estMinutes + review.estMinutes;

  return dayTasks.map((t, i) => ({
    date: isoDay(addDays(today, i)),
    dayIndex: i,
    tasks: t,
    totalMinutes: dayMinutes[i],
  }));
}

/**
 * Merge today's tasks across all courses into one prioritised list for the
 * dashboard: nearest exam first, then priority ascending, then est minutes.
 */
export function planToday(
  courses: Course[],
  progress: Progress,
  today: Date = new Date(),
): ScheduledTask[] {
  const examDateById = new Map(courses.map((c) => [c.id, c.examDate]));
  const tasks: ScheduledTask[] = [];

  for (const course of courses) {
    const cp = progress[course.id] ?? { completedTaskIds: [], weakTopics: [] };
    const [today0] = planCourse(course, cp, today);
    if (today0) tasks.push(...today0.tasks.filter((t) => !t.done));
  }

  return tasks.sort((a, b) => {
    const da = daysUntil(examDateById.get(a.courseId) ?? "", today);
    const db = daysUntil(examDateById.get(b.courseId) ?? "", today);
    if (da !== db) return da - db;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.estMinutes - b.estMinutes;
  });
}
