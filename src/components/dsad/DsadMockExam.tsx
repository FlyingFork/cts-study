"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { CheckCircleIcon, ClockIcon, InboxIcon, XCircleIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import type { Course, Drill, ExamSim } from "@/lib/schema";
import { DsadCodeLab, type DsadLabCheckResult } from "./DsadCodeLab";

type Phase = "intro" | "running" | "results";

interface SectionResult {
  correct: number;
  total: number;
  passed: boolean;
}

function mmss(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DsadMockExam({
  course,
  examSim,
  drills,
}: {
  course: Course;
  examSim: ExamSim;
  drills: Drill[];
}) {
  const { recordExamAttempt } = useStore();
  const [phase, setPhase] = useState<Phase>("intro");
  const [activeId, setActiveId] = useState(drills[0]?.id ?? "");
  const [remaining, setRemaining] = useState(examSim.timeLimitMin * 60);
  const [checks, setChecks] = useState<Record<string, SectionResult>>({});
  const recorded = useRef(false);

  const active = useMemo(
    () => drills.find((drill) => drill.id === activeId) ?? drills[0],
    [activeId, drills],
  );

  const scoreFromChecks = useCallback(
    (snapshot: Record<string, SectionResult>) => {
      const sectionCount = Math.max(drills.length, 1);
      const passedSections = drills.filter((drill) => snapshot[drill.id]?.passed).length;
      const problemPoints =
        examSim.problemPoints ?? examSim.totalPoints - (examSim.grantedPoints ?? 0);
      const raw = (examSim.grantedPoints ?? 0) + (passedSections / sectionCount) * problemPoints;
      return Math.round(Math.min(raw, examSim.totalPoints) * 10) / 10;
    },
    [drills, examSim],
  );

  const submit = useCallback(() => {
    if (recorded.current) return;
    recorded.current = true;
    const score = scoreFromChecks(checks);
    const byTopic: Record<string, { correct: number; total: number }> = {};
    for (const drill of drills) {
      const prev = byTopic[drill.topic] ?? { correct: 0, total: 0 };
      const result = checks[drill.id];
      byTopic[drill.topic] = {
        correct: prev.correct + (result?.passed ? 1 : 0),
        total: prev.total + 1,
      };
    }

    recordExamAttempt({
      id: `${course.id}-exam-${Date.now()}`,
      courseId: course.id,
      at: new Date().toISOString(),
      score,
      outOf: examSim.totalPoints,
      passed: score >= examSim.passScore,
      timeUsedMin: Math.max(1, Math.ceil((examSim.timeLimitMin * 60 - remaining) / 60)),
      byTopic,
    });
    setPhase("results");
  }, [checks, course.id, drills, examSim, recordExamAttempt, remaining, scoreFromChecks]);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = window.setTimeout(() => {
      if (remaining <= 1) submit();
      else setRemaining((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phase, remaining, submit]);

  const start = () => {
    recorded.current = false;
    setChecks({});
    setActiveId(drills[0]?.id ?? "");
    setRemaining(examSim.timeLimitMin * 60);
    setPhase("running");
  };

  const recordCheck = (drillId: string, result: DsadLabCheckResult) => {
    const total = Math.max(result.results.length, 1);
    const correct = result.results.filter((item) => item.pass).length;
    setChecks((prev) => ({
      ...prev,
      [drillId]: {
        correct,
        total,
        passed: !result.rubricFallback && correct === total,
      },
    }));
  };

  if (drills.length === 0 || !active) {
    return (
      <EmptyState
        icon={<InboxIcon className="text-4xl" />}
        title="DSAD mock unavailable"
        description="No runnable code-lab drills are configured for this mock exam."
      />
    );
  }

  if (phase === "intro") {
    return (
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-fg">{examSim.title}</h2>
          <p className="mt-1 text-sm text-fg-muted">{course.examFormat}</p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-center">
          <Spec label="Time" value={`${examSim.timeLimitMin} min`} />
          <Spec label="Pass" value={`${examSim.passScore}/${examSim.totalPoints}`} />
          <Spec label="Sections" value={`${drills.length}`} />
        </dl>
        <p className="text-xs text-fg-faint">
          Timed DSAD mock: solve each runnable section in the code lab, run Check, then submit.
        </p>
        <Button size="lg" className="w-full" onClick={start}>
          Start code-lab mock
        </Button>
      </Card>
    );
  }

  if (phase === "results") {
    const score = scoreFromChecks(checks);
    const passed = score >= examSim.passScore;
    return (
      <div className="space-y-5">
        <Card className={passed ? "border-success/50 text-center" : "border-danger/50 text-center"}>
          <p className={passed ? "text-sm font-semibold text-success" : "text-sm font-semibold text-danger"}>
            {passed ? "Pass" : "Below pass line"}
          </p>
          <p className="mt-1 text-4xl font-bold text-fg">
            {score}
            <span className="text-xl text-fg-faint"> / {examSim.totalPoints}</span>
          </p>
          <p className="mt-1 text-sm text-fg-muted">Pass line {examSim.passScore}</p>
        </Card>
        <Card className="space-y-2">
          <h2 className="text-sm font-semibold text-fg">Section checks</h2>
          {drills.map((drill) => {
            const result = checks[drill.id];
            return (
              <div key={drill.id} className="flex items-start gap-2 text-sm">
                {result?.passed ? (
                  <CheckCircleIcon className="mt-0.5 flex-none text-success" />
                ) : (
                  <XCircleIcon className="mt-0.5 flex-none text-danger" />
                )}
                <div>
                  <p className="font-medium text-fg">{drill.title}</p>
                  <p className="text-fg-muted">
                    {result ? `${result.correct}/${result.total} checks passed` : "Not checked"}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
        <Button variant="secondary" className="w-full" onClick={() => setPhase("intro")}>
          Back to mock start
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="sticky top-[8.5rem] z-20 space-y-3 bg-surface/95 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              DSAD timed mock
            </p>
            <p className="text-sm text-fg-muted">
              Pass {examSim.passScore}/{examSim.totalPoints}
            </p>
          </div>
          <Badge tone={remaining <= 60 ? "danger" : "neutral"}>
            <ClockIcon /> {mmss(remaining)}
          </Badge>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {drills.map((drill, index) => {
            const result = checks[drill.id];
            const activeSection = drill.id === active.id;
            return (
              <button
                key={drill.id}
                type="button"
                onClick={() => setActiveId(drill.id)}
                className={
                  activeSection
                    ? "flex-none rounded-lg bg-primary px-3 py-2 text-sm font-medium text-on-primary"
                    : "flex-none rounded-lg bg-surface-2 px-3 py-2 text-sm font-medium text-fg-muted"
                }
              >
                {index + 1}. {drill.topic}
                {result?.passed ? " passed" : result ? " checked" : ""}
              </button>
            );
          })}
        </div>
        <Button onClick={submit} className="w-full">
          Submit mock
        </Button>
      </Card>

      <DsadCodeLab
        key={active.id}
        drill={active}
        onCheckResult={(result) => recordCheck(active.id, result)}
      />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-2 py-2">
      <dd className="text-base font-semibold text-fg">{value}</dd>
      <dt className="text-[0.65rem] uppercase tracking-wide text-fg-muted">{label}</dt>
    </div>
  );
}
