"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CardsIcon,
  CheckIcon,
} from "@/components/icons";
import { useStore } from "@/lib/storage";

export interface LessonLink {
  id: string;
  title: string;
}

/** Lesson reader footer (06 §4): mark complete (persists, advances progress),
 *  prev/next navigation, and a suggested next step. */
export function LessonReaderFooter({
  courseId,
  lessonId,
  prev,
  next,
}: {
  courseId: string;
  lessonId: string;
  prev: LessonLink | null;
  next: LessonLink | null;
}) {
  const { state, hydrated, completeLesson } = useStore();
  const done = hydrated && !!state.lessonsCompleted[lessonId];

  return (
    <footer className="mt-8 space-y-4 border-t border-border pt-6">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        {done ? (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-success">
            <CheckIcon className="text-lg" /> Completed
          </span>
        ) : (
          <Button onClick={() => completeLesson(lessonId)} disabled={!hydrated}>
            <CheckIcon className="text-lg" /> Mark complete
          </Button>
        )}

        {done &&
          (next ? (
            <Link
              href={`/courses/${courseId}/lessons/${next.id}`}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover"
            >
              Next: {next.title}
              <ArrowRightIcon className="text-base" />
            </Link>
          ) : (
            <Link
              href={`/courses/${courseId}/flashcards`}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-surface-2 px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-3"
            >
              <CardsIcon className="text-base" /> Review flashcards
            </Link>
          ))}
      </div>

      <nav className="flex items-center justify-between gap-3 text-sm">
        {prev ? (
          <Link
            href={`/courses/${courseId}/lessons/${prev.id}`}
            className="inline-flex min-w-0 items-center gap-1.5 text-fg-muted hover:text-fg"
          >
            <ArrowLeftIcon className="flex-none text-base" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${courseId}/lessons/${next.id}`}
            className="inline-flex min-w-0 items-center gap-1.5 text-right text-fg-muted hover:text-fg"
          >
            <span className="truncate">{next.title}</span>
            <ArrowRightIcon className="flex-none text-base" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </footer>
  );
}
