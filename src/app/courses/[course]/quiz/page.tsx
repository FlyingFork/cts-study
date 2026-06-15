import { notFound } from "next/navigation";
import { getCourse, getQuestions } from "@/lib/content";
import { highlightCode } from "@/lib/highlight";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import type { RenderableQuestion } from "@/components/quiz/types";
import type { CourseId } from "@/lib/schema";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { course } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();
  const { topic } = await searchParams;

  // Pre-highlight code on the server so the client runner ships no highlighter.
  const questions: RenderableQuestion[] = await Promise.all(
    getQuestions(course as CourseId).map(async (q) =>
      q.code ? { ...q, codeHtml: await highlightCode(q.code, q.codeLang ?? "text") } : q,
    ),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-fg">Practice quiz</h1>
      <QuizRunner course={data} questions={questions} initialTopic={topic} />
    </div>
  );
}
