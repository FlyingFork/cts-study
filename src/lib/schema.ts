import { z } from "zod";

/**
 * Canonical typed content model — the single data model the whole app reads.
 * Mirrors build-docs/03-content-schema.md. Every per-course doc (10–13) must emit
 * content that validates against these schemas. Types are derived via z.infer.
 */

// ---- 1. Shared primitives ----------------------------------------------------

/** Stable, human-readable id: "<course>-<kind>-<slug>". */
export const IdSchema = z.string().min(1);
export type Id = z.infer<typeof IdSchema>;

/** Lowercase-kebab topic tag; each course defines its own set. */
export const TopicTagSchema = z.string().min(1);
export type TopicTag = z.infer<typeof TopicTagSchema>;

export const DifficultySchema = z.enum(["easy", "medium", "hard"]);
export type Difficulty = z.infer<typeof DifficultySchema>;

/** How much we trust a question's answer key (from the CTS spec). */
export const AnswerConfidenceSchema = z.enum([
  "confirmed",
  "likely",
  "attempt-selected",
  "unknown",
]);
export type AnswerConfidence = z.infer<typeof AnswerConfidenceSchema>;

export const CourseIdSchema = z.enum([
  "management",
  "macroeconomics",
  "cts",
  "dsad",
]);
export type CourseId = z.infer<typeof CourseIdSchema>;

/** lesson/path priority: 1 = must-know for passing, 3 = nice-to-have. */
const PrioritySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type Priority = z.infer<typeof PrioritySchema>;

// ---- 4. Content blocks (the lesson body) ------------------------------------

export const ContentBlockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("markdown"), md: z.string() }),
  z.object({ kind: z.literal("math"), tex: z.string(), display: z.boolean().optional() }),
  z.object({
    kind: z.literal("image"),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal("code"),
    lang: z.string(),
    code: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal("callout"),
    tone: z.enum(["note", "tip", "warning", "key"]),
    title: z.string().optional(),
    md: z.string(),
  }),
  z.object({ kind: z.literal("tryIt"), prompt: z.string(), answerMd: z.string() }),
  z.object({ kind: z.literal("walkthroughRef"), walkthroughId: IdSchema }),
  z.object({ kind: z.literal("divider") }),
]);
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

// ---- 3. Modules & lessons ----------------------------------------------------

export const LessonSchema = z.object({
  id: IdSchema,
  title: z.string(),
  summary: z.string(),
  estMinutes: z.number(),
  topicTags: z.array(TopicTagSchema),
  blocks: z.array(ContentBlockSchema),
  priority: PrioritySchema.optional(),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const ModuleSchema = z.object({
  id: IdSchema,
  title: z.string(),
  order: z.number(),
  lessons: z.array(LessonSchema),
});
export type Module = z.infer<typeof ModuleSchema>;

// ---- 5. Flashcards -----------------------------------------------------------

export const FlashcardSchema = z.object({
  id: IdSchema,
  front: z.string(),
  back: z.string(),
  topic: TopicTagSchema,
  tags: z.array(z.string()).optional(),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

export const DeckSchema = z.object({
  id: IdSchema,
  courseId: CourseIdSchema,
  cards: z.array(FlashcardSchema),
});
export type Deck = z.infer<typeof DeckSchema>;

// ---- 6. Questions (quiz + exam pool) ----------------------------------------

export const QuestionTypeSchema = z.enum([
  "mcq",
  "multi",
  "matching",
  "predict-output",
  "spot-the-bug",
  "fill-blank",
  "short-answer",
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const QuestionSchema = z.object({
  id: IdSchema,
  type: QuestionTypeSchema,
  topic: TopicTagSchema,
  difficulty: DifficultySchema,
  prompt: z.string(),
  code: z.string().optional(),
  codeLang: z.string().optional(),
  options: z.array(z.string()).optional(),
  matchPairs: z.array(z.object({ left: z.string(), right: z.string() })).optional(),
  answer: z.union([z.string(), z.array(z.string())]),
  answerConfidence: AnswerConfidenceSchema,
  explanation: z.string().optional(),
  source: z.string().optional(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionBankSchema = z.object({
  id: IdSchema,
  courseId: CourseIdSchema,
  questions: z.array(QuestionSchema),
});
export type QuestionBank = z.infer<typeof QuestionBankSchema>;

// ---- 7. Code walkthroughs (DSAD) --------------------------------------------

export const WalkthroughSchema = z.object({
  id: IdSchema,
  title: z.string(),
  method: z.string(),
  source: z.string().optional(),
  corrected: z.boolean().optional(),
  summary: z.string(),
  blocks: z.array(
    z.object({
      label: z.string(),
      note: z.string().optional(),
      lines: z.array(z.object({ code: z.string(), explain: z.string() })),
    }),
  ),
});
export type Walkthrough = z.infer<typeof WalkthroughSchema>;

// ---- 8. Drills & exam simulation --------------------------------------------

export const DrillSchema = z.object({
  id: IdSchema,
  courseId: CourseIdSchema,
  topic: TopicTagSchema,
  title: z.string(),
  task: z.string(),
  datasets: z.array(z.string()).optional(),
  starter: z.string().optional(),
  solution: z.string(),
  hints: z.array(z.string()).optional(),
  rubric: z.string(),
  // DSAD live code lab (13a) only; optional:
  runnable: z.boolean().optional(),
  entryFilename: z.string().optional(),
  expectedOutputs: z
    .array(z.object({ name: z.string(), content: z.string() }))
    .optional(),
});
export type Drill = z.infer<typeof DrillSchema>;

export const ExamSimSchema = z.object({
  id: IdSchema,
  courseId: CourseIdSchema,
  title: z.string(),
  timeLimitMin: z.number(),
  passScore: z.number(),
  totalPoints: z.number(),
  questionIds: z.array(IdSchema).optional(),
  sampleSize: z.number().optional(),
  pointsPerQuestion: z.number().optional(),
  grantedPoints: z.number().optional(),
  problemDrillIds: z.array(IdSchema).optional(),
  problemPoints: z.number().optional(),
  feedback: z.enum(["delayed", "immediate"]),
});
export type ExamSim = z.infer<typeof ExamSimSchema>;

// ---- 9. Path spec (scheduler input) -----------------------------------------

export const PathTaskSchema = z.object({
  id: IdSchema,
  kind: z.enum(["lesson", "flashcards", "quiz", "drill", "exam-sim", "review"]),
  ref: IdSchema,
  topic: TopicTagSchema.optional(),
  estMinutes: z.number(),
  priority: PrioritySchema,
});
export type PathTask = z.infer<typeof PathTaskSchema>;

export const PathSpecSchema = z.object({
  courseId: CourseIdSchema,
  dailyBudgetMin: z.number(),
  tasks: z.array(PathTaskSchema),
  mustFinishBeforeExam: z.array(IdSchema),
});
export type PathSpec = z.infer<typeof PathSpecSchema>;

// ---- 2. Course manifest ------------------------------------------------------

export const CourseSchema = z.object({
  id: CourseIdSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  accentToken: z.string(),
  examDate: z.string(), // ISO date "2026-06-18" — data, not hardcoded logic
  passLine: z.number(),
  studyTarget: z.number(),
  examFormat: z.string(),
  topicTags: z.array(TopicTagSchema),
  modules: z.array(ModuleSchema),
  deckId: IdSchema,
  questionBankId: IdSchema,
  examSim: ExamSimSchema,
  drills: z.array(DrillSchema).optional(),
  walkthroughs: z.array(WalkthroughSchema).optional(),
  path: PathSpecSchema,
});
export type Course = z.infer<typeof CourseSchema>;
