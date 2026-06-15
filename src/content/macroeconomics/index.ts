import type { Course, ExamSim, PathSpec } from "@/lib/schema";
import { macroeconomicsModules } from "./modules";
import { macroeconomicsDeck } from "./deck";
import { macroeconomicsBank } from "./questions";
import { macroeconomicsDrills } from "./drills";

export {
  macroeconomicsModules,
  macroeconomicsDeck,
  macroeconomicsBank,
  macroeconomicsDrills,
};

const TOPIC_TAGS = [
  "gdp",
  "multipliers",
  "is-lm",
  "is-lm-policy",
  "open-economy",
  "bp-curve",
  "is-lm-bp",
  "policy-shocks",
  "curve-shifts",
];

export const macroeconomicsExamSim: ExamSim = {
  id: "macroeconomics-examsim",
  courseId: "macroeconomics",
  title: "Macroeconomics - IS-LM / IS-LM-BP exam simulation",
  timeLimitMin: 90,
  passScore: 6,
  totalPoints: 10,
  problemDrillIds: [
    "macroeconomics-drill-islm-lab",
    "macroeconomics-drill-islmbp-lab",
  ],
  problemPoints: 6,
  questionIds: [
    "macroeconomics-q-is-tax-autonomous",
    "macroeconomics-q-g-cut-multiplier",
    "macroeconomics-q-multiplier-ranking",
    "macroeconomics-q-bp-definition",
    "macroeconomics-q-bp-zero-mobility",
    "macroeconomics-q-nx-output",
    "macroeconomics-q-lm-slope",
    "macroeconomics-q-is-slope",
    "macroeconomics-q-monetary-expansion-signs",
    "macroeconomics-q-gamma-vs-alpha",
    "macroeconomics-q-import-leakage",
    "macroeconomics-q-negative-cf",
    "macroeconomics-q-bd-sign",
    "macroeconomics-q-capstone-is",
    "macroeconomics-q-capstone-equilibrium",
  ],
  sampleSize: 8,
  pointsPerQuestion: 0.5,
  feedback: "delayed",
};

export const macroeconomicsPath: PathSpec = {
  courseId: "macroeconomics",
  dailyBudgetMin: 120,
  tasks: [
    {
      id: "macroeconomics-task-foundations",
      kind: "lesson",
      ref: "macroeconomics-les-foundations",
      topic: "gdp",
      estMinutes: 35,
      priority: 1,
    },
    {
      id: "macroeconomics-task-multipliers",
      kind: "lesson",
      ref: "macroeconomics-les-multipliers",
      topic: "multipliers",
      estMinutes: 50,
      priority: 2,
    },
    {
      id: "macroeconomics-task-islm-core",
      kind: "lesson",
      ref: "macroeconomics-les-islm-core",
      topic: "is-lm",
      estMinutes: 60,
      priority: 1,
    },
    {
      id: "macroeconomics-task-islm-policy",
      kind: "lesson",
      ref: "macroeconomics-les-islm-policy",
      topic: "is-lm-policy",
      estMinutes: 55,
      priority: 1,
    },
    {
      id: "macroeconomics-task-drill-islm",
      kind: "drill",
      ref: "macroeconomics-drill-islm-lab",
      topic: "is-lm",
      estMinutes: 70,
      priority: 1,
    },
    {
      id: "macroeconomics-task-open-economy",
      kind: "lesson",
      ref: "macroeconomics-les-open-economy-bp",
      topic: "open-economy",
      estMinutes: 55,
      priority: 1,
    },
    {
      id: "macroeconomics-task-islmbp-core",
      kind: "lesson",
      ref: "macroeconomics-les-islmbp-core",
      topic: "is-lm-bp",
      estMinutes: 70,
      priority: 1,
    },
    {
      id: "macroeconomics-task-drill-islmbp",
      kind: "drill",
      ref: "macroeconomics-drill-islmbp-lab",
      topic: "is-lm-bp",
      estMinutes: 80,
      priority: 1,
    },
    {
      id: "macroeconomics-task-capstone",
      kind: "lesson",
      ref: "macroeconomics-les-capstone",
      topic: "is-lm-bp",
      estMinutes: 90,
      priority: 1,
    },
    {
      id: "macroeconomics-task-flashcards",
      kind: "flashcards",
      ref: "macroeconomics-deck",
      estMinutes: 25,
      priority: 1,
    },
    {
      id: "macroeconomics-task-quiz",
      kind: "quiz",
      ref: "macroeconomics-bank",
      estMinutes: 25,
      priority: 2,
    },
  ],
  mustFinishBeforeExam: [
    "macroeconomics-task-foundations",
    "macroeconomics-task-islm-core",
    "macroeconomics-task-islm-policy",
    "macroeconomics-task-drill-islm",
    "macroeconomics-task-open-economy",
    "macroeconomics-task-islmbp-core",
    "macroeconomics-task-drill-islmbp",
    "macroeconomics-task-capstone",
    "macroeconomics-task-exam-sim",
  ],
};

export const macroeconomicsCourse: Course = {
  id: "macroeconomics",
  title: "Macroeconomics",
  subtitle: "Quantitative macro: IS-LM and IS-LM-BP problem solving",
  accentToken: "--course-macroeconomics",
  examDate: "2026-06-17",
  passLine: 6,
  studyTarget: 7,
  examFormat:
    "Two sections: one IS-LM or IS-LM-BP problem worth 6 points, self-graded by rubric, plus 8 MCQs worth 4 points - 90 min",
  topicTags: TOPIC_TAGS,
  modules: macroeconomicsModules,
  deckId: "macroeconomics-deck",
  questionBankId: "macroeconomics-bank",
  examSim: macroeconomicsExamSim,
  drills: macroeconomicsDrills,
  path: macroeconomicsPath,
};
