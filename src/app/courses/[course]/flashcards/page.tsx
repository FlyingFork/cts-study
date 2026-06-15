import { notFound } from "next/navigation";
import { getCourse, getDeck } from "@/lib/content";
import { FlashcardSession } from "@/components/flashcards/FlashcardSession";
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
  const deck = getDeck(course as CourseId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-fg">Flashcards</h1>
      {deck ? (
        <FlashcardSession course={data} deck={deck} />
      ) : (
        <EmptyState
          icon={<InboxIcon className="text-4xl" />}
          title="No flashcards yet"
          description="This course's deck is added in Phase 3."
        />
      )}
    </div>
  );
}
