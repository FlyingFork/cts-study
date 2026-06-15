import type { ComponentType, SVGProps } from "react";
import { getLesson } from "@/lib/content";
import {
  BookIcon,
  CardsIcon,
  ClockIcon,
  QuizIcon,
  TargetIcon,
  TerminalIcon,
} from "@/components/icons";
import type { ScheduledTask } from "@/lib/scheduler";

export interface TaskMeta {
  title: string;
  kindLabel: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** review/reading tasks can be ticked off manually (05 §3). */
  manualDone: boolean;
}

/** Resolve a scheduled task to a display title, deep-link, and icon. */
export function taskMeta(task: ScheduledTask): TaskMeta {
  const base = `/courses/${task.courseId}`;
  switch (task.kind) {
    case "lesson": {
      const lesson = getLesson(task.courseId, task.ref);
      return {
        title: lesson?.title ?? "Lesson",
        kindLabel: "Lesson",
        href: `${base}/lessons/${task.ref}`,
        Icon: BookIcon,
        manualDone: false,
      };
    }
    case "flashcards":
      return {
        title: task.topic ? `Flashcards · ${task.topic}` : "Flashcard review",
        kindLabel: "Flashcards",
        href: `${base}/flashcards`,
        Icon: CardsIcon,
        manualDone: true,
      };
    case "quiz":
      return {
        title: task.topic ? `Practice quiz · ${task.topic}` : "Practice quiz",
        kindLabel: "Quiz",
        href: task.topic ? `${base}/quiz?topic=${encodeURIComponent(task.topic)}` : `${base}/quiz`,
        Icon: QuizIcon,
        manualDone: false,
      };
    case "drill":
      return {
        title: "Drill / walkthrough",
        kindLabel: "Drill",
        href: `${base}/drills`,
        Icon: TerminalIcon,
        manualDone: false,
      };
    case "exam-sim":
      return {
        title: "Exam simulation",
        kindLabel: "Exam",
        href: `${base}/exam`,
        Icon: ClockIcon,
        manualDone: false,
      };
    case "review":
      return {
        title: task.topic ? `Review · ${task.topic}` : "Weak-topic review",
        kindLabel: "Review",
        href: task.topic ? `${base}/quiz?topic=${encodeURIComponent(task.topic)}` : `${base}/quiz`,
        Icon: TargetIcon,
        manualDone: true,
      };
  }
}
