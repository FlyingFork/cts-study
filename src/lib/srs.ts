// Phase 2 (build-docs/08-flashcards-srs.md): SM-2 spaced repetition.
// Pure functions; state is persisted by the store (src/lib/storage.ts).
//
// Exam-aware twist (timeline-critical): a card's next review is never scheduled
// *after* its course exam, and when the exam is ≤2 days out intervals are
// compressed so essentials get one more pass before the exam.

import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { z } from "zod";
import type { Id } from "@/lib/schema";

export const CardStateSchema = z.object({
  cardId: z.string(),
  ease: z.number(), // ease factor, starts 2.5, floor 1.3
  intervalDays: z.number(), // current interval in days
  reps: z.number(), // successful reps in a row
  due: z.string(), // ISO date (yyyy-MM-dd) the card is next due
  lapses: z.number(),
});
export type CardState = z.infer<typeof CardStateSchema>;

/** SM-2 grade buttons exposed in the UI map to these numeric grades. */
export const GRADES = { again: 1, hard: 3, good: 4, easy: 5 } as const;
export type GradeKey = keyof typeof GRADES;

const EASE_START = 2.5;
const EASE_FLOOR = 1.3;

/** Format a Date to a date-only ISO string (no time → stable across reloads). */
function isoDay(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Calendar days from `today` until `examDate` (min 0). Local to avoid a cycle. */
function daysUntilExam(examDate: string, today: Date): number {
  return Math.max(0, differenceInCalendarDays(parseISO(examDate), today));
}

/** A brand-new card: due immediately (today). */
export function newCardState(cardId: Id, today: Date = new Date()): CardState {
  return {
    cardId,
    ease: EASE_START,
    intervalDays: 0,
    reps: 0,
    due: isoDay(today),
    lapses: 0,
  };
}

/** Due if today is on or after the card's due date. */
export function isDue(state: CardState, today: Date = new Date()): boolean {
  return differenceInCalendarDays(today, parseISO(state.due)) >= 0;
}

/**
 * Apply an SM-2 review. `grade` is 0–5 (UI exposes Again=1, Hard=3, Good=4,
 * Easy=5). Pass the course `examDate` to enable the exam-aware cap/compression.
 */
export function review(
  state: CardState,
  grade: number,
  today: Date = new Date(),
  examDate?: string,
): CardState {
  let { ease, intervalDays, reps, lapses } = state;

  if (grade < 3) {
    // Lapse: reset the streak, see it again tomorrow.
    reps = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    reps += 1;
    if (reps === 1) intervalDays = 1;
    else if (reps === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * ease);

    // SM-2 ease update; clamped to the 1.3 floor.
    ease = Math.max(
      EASE_FLOOR,
      ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
    );
  }

  // Exam-aware compression: ≤2 days out, force at least one more near-term pass.
  if (examDate && daysUntilExam(examDate, today) <= 2) {
    intervalDays = Math.min(intervalDays, 1);
  }

  let due = addDays(today, intervalDays);

  // Never schedule a review after the exam.
  if (examDate) {
    const exam = parseISO(examDate);
    if (due > exam) due = exam;
  }

  return { cardId: state.cardId, ease, intervalDays, reps, lapses, due: isoDay(due) };
}
