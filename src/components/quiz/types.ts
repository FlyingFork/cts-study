import type { Question, QuestionType } from "@/lib/schema";

/** A question enriched server-side with pre-highlighted code HTML (07 §1). */
export type RenderableQuestion = Question & { codeHtml?: string };

/**
 * A learner's response, shaped per question type:
 * - mcq: the chosen option (string) or null
 * - multi: chosen options (string[])
 * - matching: chosen rights in left order (string[])
 * - predict-output / fill-blank / spot-the-bug / short-answer: free text (string)
 */
export type QResponse = string | string[] | null;

/** Types graded automatically; the rest are self-graded on reveal. */
export function isAutoGraded(type: QuestionType): boolean {
  return (
    type === "mcq" ||
    type === "multi" ||
    type === "matching" ||
    type === "predict-output" ||
    type === "fill-blank"
  );
}
