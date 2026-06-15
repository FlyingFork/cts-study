import type { Course, ExamSim, PathSpec } from "@/lib/schema";
import { managementModules } from "./modules";
import { managementDeck } from "./deck";
import { managementBank } from "./questions";
import { managementDrills } from "./drills";

/**
 * Management course — assembled manifest (build-docs/10-course-management.md).
 * Exam: 2026-06-16, pass ≥ 6/10, study target 7. Pulls together the modules,
 * deck, question bank and the nine calc drills, and defines the exam simulation
 * and the 2-day crash path. Re-exports the deck & bank for registration.
 */

export { managementDeck, managementBank, managementDrills, managementModules };

/** The full topic-tag vocabulary for this course (units + the 9 calc skills). */
const TOPIC_TAGS = [
  "foundations",
  "decision",
  "strategy",
  "mgmt-system",
  "projects",
  "hr",
  "entrepreneurship",
  "calc-vat",
  "calc-salary",
  "calc-depreciation",
  "calc-cpm",
  "calc-pert",
  "calc-npv",
  "calc-utility-electre",
  "calc-toc",
  "calc-sme",
];

/**
 * Exam simulation — a faithful replica of the real test (instructions + §1):
 * 15 graded questions (9 single + 6 multi) × 0.6 pt + 1 granted point = 10,
 * 30-minute timer, delayed feedback, pass line 6 (study target 7). Multi-correct
 * is graded as an exact-set match (grade.ts), mirroring the strict exam style.
 * The 15 ids spread across LU1–LU7 and include calculations (VAT, CPM, utility)
 * and multi-true statement sets (SMART, utility/ELECTRE).
 */
export const managementExamSim: ExamSim = {
  id: "management-examsim",
  courseId: "management",
  title: "Management — full test simulation",
  timeLimitMin: 30,
  passScore: 6,
  totalPoints: 10,
  pointsPerQuestion: 0.6,
  grantedPoints: 1,
  feedback: "delayed",
  questionIds: [
    // 9 single-correct, across the units (incl. 2 calculations)
    "management-q-1", // LU2 — decision definition
    "management-q-7", // LU1 — the five functions
    "management-q-9", // LU1 — management as a science ("any nature")
    "management-q-5", // LU4 — strategic objectives = fundamental
    "management-q-14", // LU3 — the 7 strategy components
    "management-q-23", // LU6 — interview = most common selection
    "management-q-3", // LU5 — project success = time
    "management-q-29", // LU7 — VAT from final price (calculation)
    "management-q-33", // LU5 — CPM duration (calculation)
    // 6 one-or-more-correct (incl. a calculation + multi-true sets)
    "management-q-28", // LU2 — global utility / ELECTRE (calculation, multi-true)
    "management-q-27", // LU4 — SMART objectives (multi-true)
    "management-q-pq15", // LU2 — decision requirements
    "management-q-pq16", // LU3 — SWOT
    "management-q-pq17", // LU4 — structural/processual concepts
    "management-q-pq18", // LU6 — motivation
  ],
};

/**
 * 2-day crash path (10/10 §4). Daily budget ~130 min. The scheduler (05) drops
 * lower-priority work when it can't fit and always reserves the final day for
 * the exam-sim + a weak-topic review, so we don't author those tasks here.
 * `mustFinishBeforeExam` shields the nine calc drills, the high-yield flashcards
 * and the exam-sim from being shed.
 *
 * Order: skim the priority-1 lessons → high-yield flashcards → the calc-drill
 * ladder (VAT → salary → depreciation → CPM → PERT → NPV → utility/ELECTRE →
 * TOC → SME) → a mixed practice quiz → (lower-priority lessons last).
 */
export const managementPath: PathSpec = {
  courseId: "management",
  dailyBudgetMin: 130,
  tasks: [
    // 1 — skim the priority-1 lessons (high-yield lists + key definitions)
    { id: "management-task-les-1-1", kind: "lesson", ref: "management-les-1-1", topic: "foundations", estMinutes: 10, priority: 1 },
    { id: "management-task-les-1-3", kind: "lesson", ref: "management-les-1-3", topic: "foundations", estMinutes: 12, priority: 1 },
    { id: "management-task-les-2-1", kind: "lesson", ref: "management-les-2-1", topic: "decision", estMinutes: 12, priority: 1 },
    { id: "management-task-les-2-2", kind: "lesson", ref: "management-les-2-2", topic: "decision", estMinutes: 12, priority: 1 },
    { id: "management-task-les-3-1", kind: "lesson", ref: "management-les-3-1", topic: "strategy", estMinutes: 11, priority: 1 },
    { id: "management-task-les-4-1", kind: "lesson", ref: "management-les-4-1", topic: "mgmt-system", estMinutes: 12, priority: 1 },
    { id: "management-task-les-4-2", kind: "lesson", ref: "management-les-4-2", topic: "mgmt-system", estMinutes: 12, priority: 1 },
    { id: "management-task-les-5-2", kind: "lesson", ref: "management-les-5-2", topic: "projects", estMinutes: 13, priority: 1 },
    { id: "management-task-les-7-1", kind: "lesson", ref: "management-les-7-1", topic: "entrepreneurship", estMinutes: 11, priority: 1 },
    { id: "management-task-les-7-2", kind: "lesson", ref: "management-les-7-2", topic: "entrepreneurship", estMinutes: 13, priority: 1 },

    // 2 — high-yield list/mnemonic flashcards (interleaved)
    { id: "management-task-flashcards", kind: "flashcards", ref: "management-deck", estMinutes: 25, priority: 1 },

    // 3 — the calc-drill ladder, in the recommended order
    { id: "management-task-drill-vat", kind: "drill", ref: "management-drill-vat", topic: "calc-vat", estMinutes: 10, priority: 1 },
    { id: "management-task-drill-salary", kind: "drill", ref: "management-drill-salary", topic: "calc-salary", estMinutes: 10, priority: 1 },
    { id: "management-task-drill-depreciation", kind: "drill", ref: "management-drill-depreciation", topic: "calc-depreciation", estMinutes: 9, priority: 1 },
    { id: "management-task-drill-cpm", kind: "drill", ref: "management-drill-cpm", topic: "calc-cpm", estMinutes: 10, priority: 1 },
    { id: "management-task-drill-pert", kind: "drill", ref: "management-drill-pert", topic: "calc-pert", estMinutes: 9, priority: 1 },
    { id: "management-task-drill-npv", kind: "drill", ref: "management-drill-npv", topic: "calc-npv", estMinutes: 11, priority: 1 },
    { id: "management-task-drill-utility-electre", kind: "drill", ref: "management-drill-utility-electre", topic: "calc-utility-electre", estMinutes: 12, priority: 1 },
    { id: "management-task-drill-toc", kind: "drill", ref: "management-drill-toc", topic: "calc-toc", estMinutes: 9, priority: 1 },
    { id: "management-task-drill-sme", kind: "drill", ref: "management-drill-sme", topic: "calc-sme", estMinutes: 9, priority: 1 },

    // 4 — a mixed practice quiz interleaving units + calc
    { id: "management-task-quiz", kind: "quiz", ref: "management-bank", estMinutes: 20, priority: 1 },

    // (lower priority — shed first if the 2-day budget can't fit them)
    { id: "management-task-les-3-2", kind: "lesson", ref: "management-les-3-2", topic: "strategy", estMinutes: 11, priority: 2 },
    { id: "management-task-les-5-1", kind: "lesson", ref: "management-les-5-1", topic: "projects", estMinutes: 10, priority: 2 },
    { id: "management-task-les-6-1", kind: "lesson", ref: "management-les-6-1", topic: "hr", estMinutes: 9, priority: 2 },
    { id: "management-task-les-1-2", kind: "lesson", ref: "management-les-1-2", topic: "foundations", estMinutes: 8, priority: 3 },
    { id: "management-task-les-6-2", kind: "lesson", ref: "management-les-6-2", topic: "hr", estMinutes: 11, priority: 3 },
  ],
  mustFinishBeforeExam: [
    "management-task-drill-vat",
    "management-task-drill-salary",
    "management-task-drill-depreciation",
    "management-task-drill-cpm",
    "management-task-drill-pert",
    "management-task-drill-npv",
    "management-task-drill-utility-electre",
    "management-task-drill-toc",
    "management-task-drill-sme",
    "management-task-flashcards",
    "management-task-exam-sim", // synthesised by the scheduler for the final day
  ],
};

export const managementCourse: Course = {
  id: "management",
  title: "Management",
  subtitle: "First Management test — ASE, Cybernetics · Statistics · Economic Informatics",
  accentToken: "--course-management",
  examDate: "2026-06-16",
  passLine: 6,
  studyTarget: 7,
  examFormat: "15 questions (9 single + 6 multi) × 0.6 pt + 1 granted point = 10 · 30 min",
  topicTags: TOPIC_TAGS,
  modules: managementModules,
  deckId: "management-deck",
  questionBankId: "management-bank",
  examSim: managementExamSim,
  drills: managementDrills,
  path: managementPath,
};
