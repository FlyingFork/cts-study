"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Card, EmptyState } from "@/components/ui";
import { CheckCircleIcon, ClockIcon, InboxIcon, XCircleIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import type { Course, Drill, ExamSim } from "@/lib/schema";
import { Markdown } from "@/components/lesson/Markdown";
import { QuestionCard } from "./QuestionCard";
import { gradeAnswer, shuffle, tallyByTopic } from "./grade";
import { isAutoGraded, type QResponse, type RenderableQuestion } from "./types";

type Phase = "intro" | "running" | "results";

function mmss(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function clampScore(raw: string, max: number): number {
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(max, parsed));
}

export function ExamRunner({
  course,
  examSim,
  questions,
}: {
  course: Course;
  examSim: ExamSim;
  questions: RenderableQuestion[];
}) {
  const { recordExamAttempt } = useStore();

  // Exams score only auto-gradable items (07 §1); unknown-confidence already
  // excluded upstream. Compose the fixed/sampled MCQ set.
  const eligible = useMemo(
    () => questions.filter((q) => isAutoGraded(q.type)),
    [questions],
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [pool, setPool] = useState<RenderableQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, QResponse>>({});
  const [selectedProblem, setSelectedProblem] = useState<Drill | null>(null);
  const [problemScore, setProblemScore] = useState("");
  const [remaining, setRemaining] = useState(examSim.timeLimitMin * 60);
  const recorded = useRef(false);
  const problemPoints = examSim.problemPoints ?? 0;

  const compose = (): RenderableQuestion[] => {
    let p = eligible;
    if (examSim.questionIds?.length) {
      const byId = new Map(eligible.map((q) => [q.id, q]));
      p = examSim.questionIds.map((id) => byId.get(id)).filter((q): q is RenderableQuestion => !!q);
    }
    if (examSim.sampleSize && examSim.sampleSize < p.length) {
      p = shuffle(p).slice(0, examSim.sampleSize);
    }
    return p;
  };

  const start = () => {
    const p = compose();
    const problemPool = (course.drills ?? []).filter((d) =>
      examSim.problemDrillIds?.includes(d.id),
    );
    setPool(p);
    setResponses({});
    setSelectedProblem(problemPool.length > 0 ? shuffle(problemPool)[0] : null);
    setProblemScore("");
    setRemaining(examSim.timeLimitMin * 60);
    recorded.current = false;
    setPhase("running");
  };

  const submit = useMemo(
    () => () => {
      if (recorded.current) return;
      recorded.current = true;

      const graded = pool.map((q) => ({
        topic: q.topic,
        correct: gradeAnswer(q, responses[q.id] ?? null),
      }));
      const correct = graded.filter((g) => g.correct).length;

      const mcqPoints =
        examSim.problemPoints != null ? examSim.totalPoints - examSim.problemPoints : examSim.totalPoints;
      let score = examSim.pointsPerQuestion
        ? Math.min(mcqPoints, correct * examSim.pointsPerQuestion)
        : pool.length > 0
          ? (correct / pool.length) * mcqPoints
          : 0;
      score += selectedProblem ? clampScore(problemScore, problemPoints) : 0;
      score += examSim.grantedPoints ?? 0;
      score = Math.round(Math.min(score, examSim.totalPoints) * 10) / 10;

      const timeUsedMin = Math.max(1, Math.ceil((examSim.timeLimitMin * 60 - remaining) / 60));

      recordExamAttempt({
        id: `${course.id}-exam-${Date.now()}`,
        courseId: course.id,
        at: new Date().toISOString(),
        score,
        outOf: examSim.totalPoints,
        passed: score >= examSim.passScore,
        timeUsedMin,
        byTopic: tallyByTopic(graded),
      });
      setPhase("results");
    },
    [
      pool,
      responses,
      remaining,
      examSim,
      course.id,
      recordExamAttempt,
      selectedProblem,
      problemScore,
      problemPoints,
    ],
  );

  // Countdown; auto-submit when the final second elapses.
  useEffect(() => {
    if (phase !== "running") return;
    const t = setTimeout(() => {
      if (remaining <= 1) submit();
      else setRemaining((r) => r - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, remaining, submit]);

  if (eligible.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="text-4xl" />}
        title="Exam not available yet"
        description="The exam question set for this course is added in Phase 3."
      />
    );
  }

  // ---- Intro ----------------------------------------------------------------
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
          <Spec label="Aim" value={`${course.studyTarget}/${examSim.totalPoints}`} />
        </dl>
        <p className="text-xs text-fg-faint">
          Timed with delayed feedback — results and explanations appear only after you submit.
        </p>
        <Button size="lg" className="w-full" onClick={start}>
          Start exam
        </Button>
      </Card>
    );
  }

  // ---- Results --------------------------------------------------------------
  if (phase === "results") {
    const graded = pool.map((q) => ({
      q,
      correct: gradeAnswer(q, responses[q.id] ?? null),
    }));
    const correct = graded.filter((g) => g.correct).length;
    const byTopic = tallyByTopic(graded.map((g) => ({ topic: g.q.topic, correct: g.correct })));
    const mcqPoints =
      examSim.problemPoints != null ? examSim.totalPoints - examSim.problemPoints : examSim.totalPoints;
    let score = examSim.pointsPerQuestion
      ? Math.min(mcqPoints, correct * examSim.pointsPerQuestion)
      : pool.length > 0
        ? (correct / pool.length) * mcqPoints
        : 0;
    const selfGrade = selectedProblem ? clampScore(problemScore, problemPoints) : 0;
    score += selfGrade;
    score += examSim.grantedPoints ?? 0;
    score = Math.round(Math.min(score, examSim.totalPoints) * 10) / 10;
    const passed = score >= examSim.passScore;

    return (
      <div className="space-y-5">
        <Card
          className={cn(
            "text-center",
            passed ? "border-success/50" : "border-danger/50",
          )}
        >
          <p
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold",
              passed ? "text-success" : "text-danger",
            )}
          >
            {passed ? <CheckCircleIcon className="text-lg" /> : <XCircleIcon className="text-lg" />}
            {passed ? "Pass" : "Below pass line"}
          </p>
          <p className="mt-1 text-4xl font-bold text-fg">
            {score}
            <span className="text-xl text-fg-faint"> / {examSim.totalPoints}</span>
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {correct}/{pool.length} correct · pass line {examSim.passScore}
          </p>
        </Card>

        {selectedProblem && (
          <Card className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                Problem section solution
              </p>
              <h3 className="mt-1 text-base font-semibold text-fg">{selectedProblem.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">
                Self-graded score: {selfGrade}/{problemPoints}
              </p>
            </div>
            <div className="rounded-lg border-l-2 border-l-info bg-info/5 px-3 py-2 text-sm text-fg-muted">
              <span className="font-medium text-info">Rubric: </span>
              {selectedProblem.rubric}
            </div>
            <Markdown>{selectedProblem.solution}</Markdown>
          </Card>
        )}

        <Card>
          <p className="mb-2 text-sm font-semibold text-fg">By topic</p>
          <ul className="space-y-1.5">
            {Object.entries(byTopic).map(([topic, s]) => (
              <li key={topic} className="flex items-center justify-between text-sm">
                <span className="text-fg-muted">{topic}</span>
                <span className="text-fg">
                  {s.correct}/{s.total}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-fg">Review</h3>
          <div className="space-y-4">
            {pool.map((q, i) => (
              <Card key={q.id}>
                <QuestionCard
                  question={q}
                  response={responses[q.id] ?? null}
                  onResponse={() => {}}
                  revealed
                  disabled
                  index={i}
                  total={pool.length}
                />
              </Card>
            ))}
          </div>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => setPhase("intro")}>
          Back to exam start
        </Button>
      </div>
    );
  }

  // ---- Running --------------------------------------------------------------
  const answered = pool.filter((q) => {
    const r = responses[q.id];
    return Array.isArray(r) ? r.length > 0 : typeof r === "string" ? r.trim().length > 0 : false;
  }).length;
  const low = remaining <= 60;

  return (
    <div className="space-y-5">
      <div className="sticky top-[8.5rem] z-10 flex items-center justify-between rounded-xl border border-border bg-surface/95 px-4 py-2.5 backdrop-blur">
        <span className="text-sm text-fg-muted">
          {answered}/{pool.length} answered
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums",
            low ? "text-danger" : "text-fg",
          )}
        >
          <ClockIcon className="text-base" />
          {mmss(remaining)}
        </span>
      </div>

      <div className="space-y-4">
        {selectedProblem && (
          <Card className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                Section 1 - problem ({problemPoints} pts)
              </p>
              <h2 className="mt-1 text-lg font-semibold text-fg">{selectedProblem.title}</h2>
            </div>
            <Markdown>{selectedProblem.task}</Markdown>
            <div className="rounded-lg border-l-2 border-l-info bg-info/5 px-3 py-2 text-sm text-fg-muted">
              <span className="font-medium text-info">Self-grade rubric: </span>
              {selectedProblem.rubric}
            </div>
            <label className="block">
              <span className="text-sm font-medium text-fg">Problem score</span>
              <input
                type="number"
                min={0}
                max={problemPoints}
                step={0.5}
                value={problemScore}
                onChange={(e) => setProblemScore(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-primary"
                placeholder={`0-${problemPoints}`}
              />
            </label>
          </Card>
        )}

        {selectedProblem && pool.length > 0 && (
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
            Section 2 - MCQs ({examSim.totalPoints - problemPoints} pts)
          </h2>
        )}

        {pool.map((q, i) => (
          <Card key={q.id}>
            <QuestionCard
              question={q}
              response={responses[q.id] ?? null}
              onResponse={(r) => setResponses((prev) => ({ ...prev, [q.id]: r }))}
              revealed={false}
              index={i}
              total={pool.length}
            />
          </Card>
        ))}
      </div>

      <Button size="lg" className="w-full" onClick={submit}>
        Submit exam
      </Button>
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
