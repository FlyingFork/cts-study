import { notFound } from "next/navigation";
import { getCourse } from "@/lib/content";
import { LessonList } from "@/components/lesson/LessonList";
import type { CourseId } from "@/lib/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-fg">Lessons</h1>
      <LessonList course={data} />
    </div>
  );
}
