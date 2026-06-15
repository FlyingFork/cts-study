// Phase 2 (build-docs/09-progress-persistence.md §2): pure selectors over
// AppState + content. No localStorage access here — callers pass the state in,
// so these run safely in any client component (and degrade to zero with no
// content loaded yet).

import type { AppState } from "@/lib/storage";
import type { Course, CourseId, Module, TopicTag } from "@/lib/schema";
import type { CourseProgress, Progress } from "@/lib/scheduler";
import { getDeck, getQuestionBank } from "@/lib/content";
import { isDue } from "@/lib/srs";

const MASTERY_INTERVAL_DAYS = 7; // a card counts as "mastered" at interval ≥ 7d
const MIN_TOPIC_SAMPLE = 3; // attempts needed before a topic counts as weak

export interface Ratio {
  completed: number;
  total: number;
  pct: number; // 0–100
}

function ratio(completed: number, total: number): Ratio {
  return { completed, total, pct: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

function allLessons(course: Course) {
  return course.modules.flatMap((m) => m.lessons);
}

/** Lessons completed across a whole course. */
export function lessonStats(state: AppState, course: Course): Ratio {
  const lessons = allLessons(course);
  const completed = lessons.filter((l) => state.lessonsCompleted[l.id]).length;
  return ratio(completed, lessons.length);
}

/** Lessons completed within one module. */
export function moduleStats(state: AppState, module: Module): Ratio {
  const completed = module.lessons.filter((l) => state.lessonsCompleted[l.id]).length;
  return ratio(completed, module.lessons.length);
}

/** Deck mastery: cards with interval ≥ 7 days over the deck total. */
export function deckMastery(state: AppState, courseId: CourseId): Ratio {
  const deck = getDeck(courseId);
  if (!deck || deck.cards.length === 0) return ratio(0, 0);
  const mastered = deck.cards.filter((c) => {
    const s = state.srs[c.id];
    return s && s.intervalDays >= MASTERY_INTERVAL_DAYS;
  }).length;
  return ratio(mastered, deck.cards.length);
}

export interface DueCounts {
  due: number; // seen cards now due
  fresh: number; // never-reviewed cards
  total: number;
  toReview: number; // due + fresh
}

/** Due / new / total card counts for a course's deck. */
export function dueCounts(
  state: AppState,
  courseId: CourseId,
  today: Date = new Date(),
): DueCounts {
  const deck = getDeck(courseId);
  if (!deck) return { due: 0, fresh: 0, total: 0, toReview: 0 };
  let due = 0;
  let fresh = 0;
  for (const card of deck.cards) {
    const s = state.srs[card.id];
    if (!s) fresh++;
    else if (isDue(s, today)) due++;
  }
  return { due, fresh, total: deck.cards.length, toReview: due + fresh };
}

/** All due/new cards across every course (dashboard "due flashcards"). */
export function totalDueCards(
  state: AppState,
  courses: Course[],
  today: Date = new Date(),
): number {
  return courses.reduce((acc, c) => acc + dueCounts(state, c.id, today).toReview, 0);
}

export function courseExamAttempts(state: AppState, courseId: CourseId) {
  return state.examAttempts.filter((a) => a.courseId === courseId);
}

/** Best exam-sim score for a course (0–outOf), or null if never attempted. */
export function bestExam(state: AppState, courseId: CourseId) {
  const attempts = courseExamAttempts(state, courseId);
  if (attempts.length === 0) return null;
  return attempts.reduce((best, a) => (a.score > best.score ? a : best));
}

/** Most recent exam-sim attempt for a course, or null. */
export function lastExam(state: AppState, courseId: CourseId) {
  const attempts = courseExamAttempts(state, courseId);
  return attempts.length ? attempts[attempts.length - 1] : null;
}

export function topicAccuracy(state: AppState, topic: TopicTag): number | null {
  const s = state.topicStats[topic];
  if (!s || s.total === 0) return null;
  return s.correct / s.total;
}

/**
 * Weakest topics for a course, lowest accuracy first. Only topics with enough
 * attempts (≥3) are considered, so a single miss doesn't dominate.
 */
export function weakTopics(state: AppState, course: Course): TopicTag[] {
  return course.topicTags
    .map((t) => ({ topic: t, acc: state.topicStats[t] }))
    .filter((x) => x.acc && x.acc.total >= MIN_TOPIC_SAMPLE)
    .sort((a, b) => a.acc!.correct / a.acc!.total - b.acc!.correct / b.acc!.total)
    .map((x) => x.topic);
}

/**
 * A single 0–100 readiness number for the dashboard ring: blends lesson
 * completion, deck mastery, and best exam-sim score vs. the study target.
 */
export function courseReadiness(state: AppState, course: Course): number {
  const lessons = lessonStats(state, course).pct / 100;
  const mastery = deckMastery(state, course.id).pct / 100;
  const best = bestExam(state, course.id);
  const examReadiness = best ? Math.min(1, best.score / course.studyTarget) : 0;
  return Math.round(100 * (0.4 * lessons + 0.3 * mastery + 0.3 * examReadiness));
}

/** Whether the best exam-sim score has cleared the official pass line. */
export function meetsPassLine(state: AppState, course: Course): boolean {
  const best = bestExam(state, course.id);
  return !!best && best.score >= course.passLine;
}

export function overallReadiness(state: AppState, courses: Course[]): number {
  if (courses.length === 0) return 0;
  const sum = courses.reduce((acc, c) => acc + courseReadiness(state, c), 0);
  return Math.round(sum / courses.length);
}

/**
 * Which of a course's path tasks are complete — explicitly (taskDone) or
 * derived from the underlying activity (a finished lesson, a recorded exam, …).
 */
export function completedTaskIds(state: AppState, course: Course): string[] {
  const done: string[] = [];
  for (const task of course.path.tasks) {
    if (state.taskDone[task.id]) {
      done.push(task.id);
      continue;
    }
    switch (task.kind) {
      case "lesson":
        if (state.lessonsCompleted[task.ref]) done.push(task.id);
        break;
      case "exam-sim":
        if (courseExamAttempts(state, course.id).length > 0) done.push(task.id);
        break;
      case "quiz":
        if (state.quizResults.some((r) => r.courseId === course.id)) done.push(task.id);
        break;
      // flashcards / drill / review complete only via an explicit mark-done.
      default:
        break;
    }
  }
  return done;
}

/** Build the scheduler's per-course progress view. */
export function courseSchedulerProgress(state: AppState, course: Course): CourseProgress {
  return {
    completedTaskIds: completedTaskIds(state, course),
    weakTopics: weakTopics(state, course),
  };
}

/** Build the scheduler's cross-course progress map. */
export function schedulerProgress(state: AppState, courses: Course[]): Progress {
  const map: Progress = {};
  for (const course of courses) {
    map[course.id] = courseSchedulerProgress(state, course);
  }
  return map;
}

/** Count practice questions available in a course (for empty-state checks). */
export function questionCount(courseId: CourseId): number {
  return getQuestionBank(courseId)?.questions.length ?? 0;
}
