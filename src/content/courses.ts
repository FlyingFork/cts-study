import type { Course, Deck, QuestionBank } from "@/lib/schema";
import {
  managementCourse,
  managementDeck,
  managementBank,
} from "@/content/management";
import {
  macroeconomicsCourse,
  macroeconomicsDeck,
  macroeconomicsBank,
} from "@/content/macroeconomics";
import { ctsCourse, ctsDeck, ctsBank } from "@/content/cts";
import { dsadCourse, dsadDeck, dsadBank } from "@/content/dsad";

/**
 * Registry of converted course content. Each course's manifest, flashcard deck,
 * and question bank are registered here once converted (Phase 3, docs 10–13).
 * Decks/banks are referenced from a Course by `deckId` / `questionBankId` and
 * resolved by `courseId` in src/lib/content.ts.
 *
 * Converted: Management (doc 10), Macroeconomics (doc 11), CTS (doc 12),
 * and DSAD (doc 13 + 13a).
 */
export const courses: Course[] = [
  managementCourse,
  macroeconomicsCourse,
  ctsCourse,
  dsadCourse,
];
export const decks: Deck[] = [
  managementDeck,
  macroeconomicsDeck,
  ctsDeck,
  dsadDeck,
];
export const questionBanks: QuestionBank[] = [
  managementBank,
  macroeconomicsBank,
  ctsBank,
  dsadBank,
];
