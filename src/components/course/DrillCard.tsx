"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { Markdown } from "@/components/lesson/Markdown";
import { TerminalIcon } from "@/components/icons";
import type { Drill } from "@/lib/schema";

/** A drill / calc exercise (10/13). The live Pyodide code lab is Phase 3 (13a);
 *  here we present the task with progressive hints and a reveal-able solution. */
export function DrillCard({ drill }: { drill: Drill }) {
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const hints = drill.hints ?? [];

  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-fg">{drill.title}</h3>
        <Badge tone="neutral">{drill.topic}</Badge>
        {drill.runnable && <Badge tone="info">code lab</Badge>}
      </div>

      <Markdown>{drill.task}</Markdown>

      {drill.datasets && drill.datasets.length > 0 && (
        <p className="text-xs text-fg-faint">Datasets: {drill.datasets.join(", ")}</p>
      )}

      {hints.length > 0 && (
        <div className="space-y-2">
          {hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-fg-muted">
              Hint {i + 1}: {h}
            </p>
          ))}
          {hintsShown < hints.length && (
            <button
              type="button"
              onClick={() => setHintsShown((n) => n + 1)}
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              Show hint {hintsShown + 1}
            </button>
          )}
        </div>
      )}

      <div className="rounded-lg border-l-2 border-l-info bg-info/5 px-3 py-2 text-sm text-fg-muted">
        <span className="font-medium text-info">Goal: </span>
        {drill.rubric}
      </div>

      {drill.runnable && (
        <Link
          href={`/courses/${drill.courseId}/code-lab/${drill.id}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <TerminalIcon /> Open code lab
        </Link>
      )}

      {showSolution ? (
        <div className="border-t border-border pt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">Solution</p>
          <Markdown>{drill.solution}</Markdown>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowSolution(true)}
          className="text-sm font-medium text-fg-muted hover:text-fg"
        >
          Show solution
        </button>
      )}
    </Card>
  );
}
