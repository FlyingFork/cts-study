"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import type { ScheduledTask } from "@/lib/scheduler";
import { taskMeta } from "./task-meta";

const PRIORITY_BADGE: Record<number, { label: string; tone: "primary" | "info" | "neutral" }> = {
  1: { label: "Essential", tone: "primary" },
  2: { label: "Core", tone: "info" },
  3: { label: "Extra", tone: "neutral" },
};

/** One task in a "today's plan" checklist (05 §3). Reused on the dashboard and
 *  on each course home. Completing the underlying activity (or a manual tick for
 *  review/reading tasks) marks it done and lets the plan re-compute. */
export function TaskRow({
  task,
  accent,
  courseLabel,
}: {
  task: ScheduledTask;
  accent?: string;
  courseLabel?: string;
}) {
  const { setTaskDone } = useStore();
  const meta = taskMeta(task);
  const prio = PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE[2];

  if (task.done) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-fg-muted">
        <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-success/15 text-success">
          <CheckIcon className="text-base" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm line-through">{meta.title}</span>
        {meta.manualDone && (
          <button
            type="button"
            onClick={() => setTaskDone(task.id, false)}
            className="text-xs font-medium text-fg-faint hover:text-fg"
          >
            Undo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
      <span
        aria-hidden
        className="grid h-9 w-9 flex-none place-items-center rounded-lg text-lg"
        style={{
          color: accent ?? "var(--primary)",
          backgroundColor: `color-mix(in srgb, ${accent ?? "var(--primary)"} 14%, var(--surface))`,
        }}
      >
        <meta.Icon />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{meta.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted">
          {courseLabel && <span className="font-medium">{courseLabel}</span>}
          <span>{meta.kindLabel}</span>
          <span aria-hidden>·</span>
          <span>~{task.estMinutes} min</span>
          <Badge tone={prio.tone} className="ml-0.5">
            {prio.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-none items-center gap-1.5">
        {meta.manualDone && (
          <button
            type="button"
            onClick={() => setTaskDone(task.id, true)}
            aria-label="Mark done"
            className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CheckIcon className="text-lg" />
          </button>
        )}
        <Link
          href={meta.href}
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-surface-2 px-3 text-sm font-medium text-fg transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Start
          <ArrowRightIcon className="text-base" />
        </Link>
      </div>
    </div>
  );
}
