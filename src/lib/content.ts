import { z } from "zod";
import {
  CourseSchema,
  DeckSchema,
  QuestionBankSchema,
  type Course,
  type CourseId,
  type Deck,
  type Difficulty,
  type ExamSim,
  type Id,
  type Lesson,
  type Question,
  type QuestionBank,
  type QuestionType,
  type TopicTag,
} from "@/lib/schema";
import {
  courses as rawCourses,
  decks as rawDecks,
  questionBanks as rawQuestionBanks,
} from "@/content/courses";

/**
 * Content loader. Validates every content module against the zod schema (03) at
 * import time — invalid content throws a clear, located error (in dev this
 * surfaces immediately; in a prod build it fails the build, since content is
 * statically imported rather than fetched). Exposes typed getters (01 §4).
 */

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

/** Parse `data` against `schema`, throwing a readable error tagged with `label`. */
export function validateContent<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${label}:\n${formatZodError(result.error)}`,
    );
  }
  return result.data;
}

const courses: Course[] = validateContent(
  z.array(CourseSchema),
  rawCourses,
  "content/courses.ts → courses",
);
const decks: Deck[] = validateContent(
  z.array(DeckSchema),
  rawDecks,
  "content/courses.ts → decks",
);
const questionBanks: QuestionBank[] = validateContent(
  z.array(QuestionBankSchema),
  rawQuestionBanks,
  "content/courses.ts → questionBanks",
);

// ---- Typed getters -----------------------------------------------------------

export function getCourses(): Course[] {
  return courses;
}

export function getCourse(id: CourseId): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getLesson(
  courseId: CourseId,
  lessonId: Id,
): Lesson | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getDeck(courseId: CourseId): Deck | undefined {
  return decks.find((d) => d.courseId === courseId);
}

export function getQuestionBank(courseId: CourseId): QuestionBank | undefined {
  return questionBanks.find((b) => b.courseId === courseId);
}

export function getExamSim(courseId: CourseId): ExamSim | undefined {
  return getCourse(courseId)?.examSim;
}

export interface QuestionFilter {
  topic?: TopicTag;
  difficulty?: Difficulty;
  type?: QuestionType;
  /** Drop questions whose answer key is "unknown" (e.g. for scored exam sims). */
  excludeUnknownConfidence?: boolean;
}

export function getQuestions(
  courseId: CourseId,
  filter: QuestionFilter = {},
): Question[] {
  const bank = getQuestionBank(courseId);
  if (!bank) return [];
  return bank.questions.filter((q) => {
    if (filter.topic && q.topic !== filter.topic) return false;
    if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
    if (filter.type && q.type !== filter.type) return false;
    if (filter.excludeUnknownConfidence && q.answerConfidence === "unknown") {
      return false;
    }
    return true;
  });
}
