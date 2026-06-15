import { notFound } from "next/navigation";
import { getCourse, getCourses } from "@/lib/content";
import { CourseSubHeader } from "@/components/nav/CourseSubHeader";
import type { CourseId } from "@/lib/schema";

// Prerender the known courses (empty until Phase 3 → routes resolve dynamically,
// and any unknown [course] falls through to notFound below).
export function generateStaticParams() {
  return getCourses().map((c) => ({ course: c.id }));
}

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();

  return (
    <div className="-mt-5">
      <CourseSubHeader course={data} />
      <div className="pt-5">{children}</div>
    </div>
  );
}
