import { notFound } from "next/navigation";
import { getCourse } from "@/lib/content";
import { renderWalkthrough } from "@/components/lesson/walkthrough-data";
import { Walkthrough } from "@/components/lesson/Walkthrough";
import { DrillCard } from "@/components/course/DrillCard";
import { DsadMethodSelector } from "@/components/dsad/DsadMethodSelector";
import { EmptyState } from "@/components/ui";
import { InboxIcon } from "@/components/icons";
import type { CourseId } from "@/lib/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const data = getCourse(course as CourseId);
  if (!data) notFound();

  const drills = data.drills ?? [];
  const walkthroughs = data.walkthroughs ?? [];

  if (drills.length === 0 && walkthroughs.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Drills</h1>
        <EmptyState
          icon={<InboxIcon className="text-4xl" />}
          title="No drills yet"
          description="Drills and code walkthroughs for this course are added in Phase 3."
        />
      </div>
    );
  }

  const rendered = await Promise.all(walkthroughs.map(renderWalkthrough));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-fg">Drills &amp; walkthroughs</h1>

      {data.id === "dsad" && <DsadMethodSelector />}

      {rendered.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-fg">Walkthroughs</h2>
          {rendered.map((w) => (
            <Walkthrough key={w.id} data={w} />
          ))}
        </section>
      )}

      {drills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-fg">Drills</h2>
          {drills.map((d) => (
            <DrillCard key={d.id} drill={d} />
          ))}
        </section>
      )}
    </div>
  );
}
