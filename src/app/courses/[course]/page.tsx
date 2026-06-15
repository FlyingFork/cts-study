import { notFound } from "next/navigation";
import { getCourse } from "@/lib/content";
import { CourseHome } from "@/components/course/CourseHome";
import type { CourseId } from "@/lib/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();
  return <CourseHome course={data} />;
}
