import { notFound } from "next/navigation";
import { getCourse, getExamSim, getQuestions } from "@/lib/content";
import { highlightCode } from "@/lib/highlight";
import { ExamRunner } from "@/components/quiz/ExamRunner";
import { DsadMockExam } from "@/components/dsad/DsadMockExam";
import { EmptyState } from "@/components/ui";
import { InboxIcon } from "@/components/icons";
import type { RenderableQuestion } from "@/components/quiz/types";
import type { CourseId } from "@/lib/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();
  const examSim = getExamSim(course as CourseId);

  // Scored exam → exclude unknown-confidence questions (07 §3).
  const questions: RenderableQuestion[] = await Promise.all(
    getQuestions(course as CourseId, { excludeUnknownConfidence: true }).map(async (q) =>
      q.code ? { ...q, codeHtml: await highlightCode(q.code, q.codeLang ?? "text") } : q,
    ),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-fg">Exam simulation</h1>
      {examSim && data.id === "dsad" ? (
        <DsadMockExam
          course={data}
          examSim={examSim}
          drills={(data.drills ?? []).filter((drill) =>
            examSim.problemDrillIds?.includes(drill.id),
          )}
        />
      ) : examSim ? (
        <ExamRunner course={data} examSim={examSim} questions={questions} />
      ) : (
        <EmptyState
          icon={<InboxIcon className="text-4xl" />}
          title="Exam not available yet"
          description="The exam question set for this course is added in Phase 3."
        />
      )}
    </div>
  );
}
