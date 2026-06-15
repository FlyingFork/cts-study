import { notFound } from "next/navigation";
import { getCourse } from "@/lib/content";
import { DsadCodeLab } from "@/components/dsad/DsadCodeLab";
import type { CourseId } from "@/lib/schema";

export function generateStaticParams() {
  const dsad = getCourse("dsad");
  return (
    dsad?.drills
      ?.filter((drill) => drill.runnable)
      .map((drill) => ({ course: "dsad", drill: drill.id })) ?? []
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ course: string; drill: string }>;
}) {
  const { course, drill } = await params;
  const data = getCourse(course as CourseId);
  if (!data || data.id !== "dsad") notFound();

  const selected = data.drills?.find((item) => item.id === drill);
  if (!selected || !selected.runnable) notFound();

  return <DsadCodeLab drill={selected} />;
}
