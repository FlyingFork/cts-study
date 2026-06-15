import type { Question } from "@/lib/schema";
import type { ByTopic } from "@/lib/storage";
import { isAutoGraded, type QResponse } from "./types";

/** Normalise free-text for lenient comparison (trim, collapse ws, lowercase). */
export function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function asArray(answer: string | string[]): string[] {
  return Array.isArray(answer) ? answer : [answer];
}

/** Auto-grade a response. Self-graded types always return false here (the UI
 *  collects the learner's self-assessment instead — see `isAutoGraded`). */
export function gradeAnswer(q: Question, response: QResponse): boolean {
  switch (q.type) {
    case "mcq":
      return typeof q.answer === "string" && response === q.answer;
    case "multi": {
      const ans = asArray(q.answer);
      const sel = Array.isArray(response) ? response : [];
      return ans.length === sel.length && ans.every((a) => sel.includes(a));
    }
    case "matching": {
      const ans = asArray(q.answer);
      const sel = Array.isArray(response) ? response : [];
      return ans.length === sel.length && ans.every((a, i) => sel[i] === a);
    }
    case "predict-output":
    case "fill-blank":
      return (
        typeof q.answer === "string" &&
        typeof response === "string" &&
        normalize(response) === normalize(q.answer)
      );
    default:
      return false; // spot-the-bug / short-answer → self-graded
  }
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Resolve final correctness, using self-grade for self-graded types. */
export function isCorrect(
  q: Question,
  response: QResponse,
  selfCorrect: boolean | null,
): boolean {
  if (isAutoGraded(q.type)) return gradeAnswer(q, response);
  return selfCorrect === true;
}

/** Tally correctness by topic for storage (09). */
export function tallyByTopic(
  entries: { topic: string; correct: boolean }[],
): ByTopic {
  const byTopic: ByTopic = {};
  for (const { topic, correct } of entries) {
    const prev = byTopic[topic] ?? { correct: 0, total: 0 };
    byTopic[topic] = { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 };
  }
  return byTopic;
}
