import type { Course, ExamSim, PathSpec } from "@/lib/schema";
import { ctsModules } from "./modules";
import { ctsDeck } from "./deck";
import { ctsBank, ctsExamQuestionIds } from "./questions";

export { ctsModules, ctsDeck, ctsBank };

const TOPIC_TAGS = [
  "clean-code",
  "solid",
  "design-patterns",
  "junit-4",
  "test-design",
  "coverage",
];

export const ctsExamSim: ExamSim = {
  id: "cts-examsim",
  courseId: "cts",
  title: "CTS - 50-question delayed-feedback simulation",
  timeLimitMin: 90,
  passScore: 8,
  totalPoints: 10,
  pointsPerQuestion: 0.2,
  feedback: "delayed",
  questionIds: ctsExamQuestionIds,
  sampleSize: 50,
};

export const ctsPath: PathSpec = {
  courseId: "cts",
  dailyBudgetMin: 120,
  tasks: [
    {
      id: "cts-task-diagnostic",
      kind: "quiz",
      ref: "cts-bank",
      estMinutes: 20,
      priority: 1,
    },
    {
      id: "cts-task-pattern-intents",
      kind: "lesson",
      ref: "cts-les-pattern-intents",
      topic: "design-patterns",
      estMinutes: 55,
      priority: 1,
    },
    {
      id: "cts-task-pattern-distinctions",
      kind: "lesson",
      ref: "cts-les-pattern-distinctions",
      topic: "design-patterns",
      estMinutes: 45,
      priority: 1,
    },
    {
      id: "cts-task-flashcards",
      kind: "flashcards",
      ref: "cts-deck",
      estMinutes: 30,
      priority: 1,
    },
    {
      id: "cts-task-solid",
      kind: "lesson",
      ref: "cts-les-solid-intent",
      topic: "solid",
      estMinutes: 30,
      priority: 1,
    },
    {
      id: "cts-task-clean-code",
      kind: "lesson",
      ref: "cts-les-clean-code-core",
      topic: "clean-code",
      estMinutes: 25,
      priority: 2,
    },
    {
      id: "cts-task-junit",
      kind: "lesson",
      ref: "cts-les-junit-4",
      topic: "junit-4",
      estMinutes: 25,
      priority: 1,
    },
    {
      id: "cts-task-test-design",
      kind: "lesson",
      ref: "cts-les-test-design",
      topic: "test-design",
      estMinutes: 30,
      priority: 1,
    },
    {
      id: "cts-task-coverage",
      kind: "lesson",
      ref: "cts-les-coverage",
      topic: "coverage",
      estMinutes: 35,
      priority: 1,
    },
    {
      id: "cts-task-weak-quiz",
      kind: "quiz",
      ref: "cts-bank",
      estMinutes: 25,
      priority: 1,
    },
    {
      id: "cts-task-exam-sim",
      kind: "exam-sim",
      ref: "cts-examsim",
      estMinutes: 90,
      priority: 1,
    },
    {
      id: "cts-task-review-confusions",
      kind: "review",
      ref: "design-patterns",
      topic: "design-patterns",
      estMinutes: 30,
      priority: 1,
    },
  ],
  mustFinishBeforeExam: [
    "cts-task-pattern-intents",
    "cts-task-pattern-distinctions",
    "cts-task-flashcards",
    "cts-task-solid",
    "cts-task-junit",
    "cts-task-test-design",
    "cts-task-coverage",
    "cts-task-exam-sim",
    "cts-task-review-confusions",
  ],
};

export const ctsCourse: Course = {
  id: "cts",
  title: "Software Quality & Testing",
  subtitle: "CTS pattern recognition, SOLID, JUnit 4, heuristics, and coverage",
  accentToken: "--course-cts",
  examDate: "2026-06-18",
  passLine: 8,
  studyTarget: 9,
  examFormat:
    "50 mixed Moodle-style questions, delayed feedback, 0.2 points each, pass line 8/10, study target 9/10",
  topicTags: TOPIC_TAGS,
  modules: ctsModules,
  deckId: "cts-deck",
  questionBankId: "cts-bank",
  examSim: ctsExamSim,
  path: ctsPath,
};
