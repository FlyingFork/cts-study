import { notFound } from "next/navigation";
import { getCourse, getCourses, getLesson } from "@/lib/content";
import { Badge } from "@/components/ui";
import { LessonBody } from "@/components/lesson/LessonBody";
import { LessonReaderFooter } from "@/components/lesson/LessonReaderFooter";
import type { CourseId } from "@/lib/schema";

export function generateStaticParams() {
  return getCourses().flatMap((c) =>
    c.modules.flatMap((m) => m.lessons.map((l) => ({ course: c.id, lesson: l.id }))),
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course, lesson } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();
  const current = getLesson(course as CourseId, lesson);
  if (!current) notFound();

  const flat = data.modules.flatMap((m) => m.lessons);
  const i = flat.findIndex((l) => l.id === lesson);
  const prev = i > 0 ? { id: flat[i - 1].id, title: flat[i - 1].title } : null;
  const next = i < flat.length - 1 ? { id: flat[i + 1].id, title: flat[i + 1].title } : null;

  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-fg">{current.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
          <span>~{current.estMinutes} min</span>
          {current.topicTags.map((t) => (
            <Badge key={t} tone="neutral">
              {t}
            </Badge>
          ))}
        </div>
      </header>

      <LessonBody blocks={current.blocks} courseId={data.id} walkthroughs={data.walkthroughs} />

      <LessonReaderFooter
        courseId={data.id}
        lessonId={current.id}
        prev={prev}
        next={next}
      />
    </article>
  );
}
