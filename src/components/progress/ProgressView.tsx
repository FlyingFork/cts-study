"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { accentVar } from "@/lib/utils";
import { Button, Card, EmptyState, ProgressRing } from "@/components/ui";
import { FlameIcon, InboxIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import {
  bestExam,
  courseReadiness,
  deckMastery,
  lessonStats,
  overallReadiness,
  weakTopics,
} from "@/lib/progress";
import type { Course } from "@/lib/schema";

/** Cross-course progress & analytics (09 §2/§3) + reset / export / import. */
export function ProgressView({ courses }: { courses: Course[] }) {
  const { state, hydrated, resetProgress, exportState, importState } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-surface" aria-busy />;
  }

  const download = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-platform-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile = async (file: File) => {
    const ok = importState(await file.text());
    setMessage(ok ? "Progress imported." : "Import failed — invalid backup file.");
  };

  const reset = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      resetProgress();
      setMessage("Progress reset.");
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-fg">Progress</h1>
        <p className="text-sm text-fg-muted">Your readiness and study analytics across courses.</p>
      </header>

      <Card className="flex items-center gap-5">
        <ProgressRing value={overallReadiness(state, courses)} size={84} strokeWidth={8} />
        <div className="space-y-1">
          <p className="text-sm font-medium text-fg">Overall readiness</p>
          <p className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
            <FlameIcon className="text-base text-warning" /> {state.streak.count}-day streak
          </p>
        </div>
      </Card>

      {courses.length === 0 ? (
        <EmptyState
          icon={<InboxIcon className="text-4xl" />}
          title="No courses yet"
          description="Per-course analytics appear here once content is loaded in Phase 3."
        />
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-fg">Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((c) => {
              const best = bestExam(state, c.id);
              const weak = weakTopics(state, c);
              return (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="focus-visible:outline-none"
                >
                  <Card accent={accentVar(c.accentToken)} className="flex items-center gap-4">
                    <ProgressRing
                      value={courseReadiness(state, c)}
                      color={accentVar(c.accentToken)}
                      size={56}
                      strokeWidth={6}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{c.title}</p>
                      <p className="text-xs text-fg-muted">
                        Lessons {lessonStats(state, c).pct}% · Deck {deckMastery(state, c.id).pct}%
                      </p>
                      <p className="text-xs text-fg-muted">
                        Best exam: {best ? `${best.score}/${best.outOf}` : "—"}
                      </p>
                      {weak[0] && (
                        <p className="truncate text-xs text-fg-faint">Weak: {weak[0]}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Backup &amp; reset</h2>
        <Card className="space-y-4">
          <p className="text-sm text-fg-muted">
            All progress lives in this browser. Export a backup, restore it on another device, or
            reset to start over.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={download}>
              Export JSON
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Import JSON
            </Button>
            <Button variant="danger" onClick={reset}>
              Reset progress
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImportFile(file);
                e.target.value = "";
              }}
            />
          </div>
          {message && <p className="text-sm text-info">{message}</p>}
        </Card>
      </section>
    </div>
  );
}
