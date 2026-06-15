import type { Course, Deck, QuestionBank } from "@/lib/schema";

/**
 * Throwaway fixtures used only to demonstrate schema validation (doc 03 §11):
 * a tiny valid course (+ deck + bank) that parses clean, and an intentionally
 * malformed object that makes the schema throw a clear, located error.
 * Not registered in courses.ts. Safe to delete once real content exists.
 */

export const validCourse: Course = {
  id: "management",
  title: "Fixture Course",
  subtitle: "A minimal course used to smoke-test the schema",
  accentToken: "--course-management",
  examDate: "2026-06-16",
  passLine: 6,
  studyTarget: 7,
  examFormat: "15 MCQ, 30 min",
  topicTags: ["decision"],
  modules: [
    {
      id: "mgmt-mod-1",
      title: "LU1 — Intro",
      order: 1,
      lessons: [
        {
          id: "mgmt-les-intro",
          title: "Intro",
          summary: "A tiny lesson with a few block kinds.",
          estMinutes: 5,
          topicTags: ["decision"],
          priority: 1,
          blocks: [
            { kind: "markdown", md: "Hello **world**." },
            { kind: "math", tex: "E = mc^2", display: true },
            { kind: "callout", tone: "key", title: "Key", md: "Remember this." },
            { kind: "divider" },
          ],
        },
      ],
    },
  ],
  deckId: "management-deck",
  questionBankId: "management-bank",
  examSim: {
    id: "management-examsim",
    courseId: "management",
    title: "Mock Exam",
    timeLimitMin: 30,
    passScore: 6,
    totalPoints: 10,
    questionIds: ["management-q-1"],
    feedback: "delayed",
  },
  path: {
    courseId: "management",
    dailyBudgetMin: 120,
    tasks: [
      {
        id: "management-task-1",
        kind: "lesson",
        ref: "mgmt-les-intro",
        topic: "decision",
        estMinutes: 5,
        priority: 1,
      },
    ],
    mustFinishBeforeExam: ["management-task-1"],
  },
};

export const validDeck: Deck = {
  id: "management-deck",
  courseId: "management",
  cards: [
    {
      id: "management-fc-1",
      front: "What is a decision?",
      back: "A choice among alternatives.",
      topic: "decision",
    },
  ],
};

export const validQuestionBank: QuestionBank = {
  id: "management-bank",
  courseId: "management",
  questions: [
    {
      id: "management-q-1",
      type: "mcq",
      topic: "decision",
      difficulty: "easy",
      prompt: "2 + 2 = ?",
      options: ["3", "4", "5"],
      answer: "4",
      answerConfidence: "confirmed",
    },
  ],
};

/**
 * Intentionally broken: `passLine` is a string, `examDate`/`examSim`/`path` are
 * missing. Typed as `unknown` so it can be fed to safeParse to prove the schema
 * rejects bad content with a useful message.
 */
export const malformedCourse: unknown = {
  id: "management",
  title: "Broken Course",
  accentToken: "--course-management",
  passLine: "six",
  studyTarget: 7,
  examFormat: "x",
  topicTags: [],
  modules: [],
  deckId: "management-deck",
  questionBankId: "management-bank",
};
