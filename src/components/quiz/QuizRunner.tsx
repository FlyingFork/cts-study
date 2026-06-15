"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Card, EmptyState } from "@/components/ui";
import { InboxIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import { weakTopics } from "@/lib/progress";
import type { Course, Difficulty } from "@/lib/schema";
import { QuestionCard } from "./QuestionCard";
import { isCorrect, shuffle, tallyByTopic } from "./grade";
import { isAutoGraded, type QResponse, type RenderableQuestion } from "./types";

type Phase = "setup" | "running" | "done";
interface Result {
  id: string;
  topic: string;
  correct: boolean;
}

const DIFFICULTIES: (Difficulty | "any")[] = ["any", "easy", "medium", "hard"];
const COUNTS = [5, 10, 20];

export function QuizRunner({
  course,
  questions,
  initialTopic,
}: {
  course: Course;
  questions: RenderableQuestion[];
  initialTopic?: string;
}) {
  const { state, recordQuizResult } = useStore();

  const topics = useMemo(
    () => Array.from(new Set(questions.map((q) => q.topic))).sort(),
    [questions],
  );

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(
    new Set(initialTopic && topics.includes(initialTopic) ? [initialTopic] : []),
  );
  const [difficulty, setDifficulty] = useState<Difficulty | "any">("any");
  const [count, setCount] = useState(10);

  const [pool, setPool] = useState<RenderableQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QResponse>(null);
  const [revealed, setRevealed] = useState(false);
  const [selfCorrect, setSelfCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="text-4xl" />}
        title="No practice questions yet"
        description="The question bank for this course is added in Phase 3."
      />
    );
  }

  const resetCurrent = () => {
    setResponse(null);
    setRevealed(false);
    setSelfCorrect(null);
  };

  const begin = (qs: RenderableQuestion[]) => {
    if (qs.length === 0) return;
    setPool(qs);
    setIndex(0);
    setResults([]);
    resetCurrent();
    setPhase("running");
  };

  const startFromSetup = () => {
    let pooled = questions;
    if (selectedTopics.size > 0) pooled = pooled.filter((q) => selectedTopics.has(q.topic));
    if (difficulty !== "any") pooled = pooled.filter((q) => q.difficulty === difficulty);
    begin(shuffle(pooled).slice(0, count));
  };

  const startWeakTopics = () => {
    const weak = new Set(weakTopics(state, course));
    const pooled = weak.size > 0 ? questions.filter((q) => weak.has(q.topic)) : questions;
    begin(shuffle(pooled).slice(0, 10));
  };

  const finish = (rs: Result[]) => {
    const byTopic = tallyByTopic(rs);
    recordQuizResult({
      id: `${course.id}-quiz-${Date.now()}`,
      courseId: course.id,
      at: new Date().toISOString(),
      topicFilter: selectedTopics.size > 0 ? [...selectedTopics] : undefined,
      total: rs.length,
      correct: rs.filter((r) => r.correct).length,
      byTopic,
    });
    setResults(rs);
    setPhase("done");
  };

  const next = () => {
    const q = pool[index];
    const rs =
      q.answerConfidence === "unknown"
        ? results
        : [...results, { id: q.id, topic: q.topic, correct: isCorrect(q, response, selfCorrect) }];
    if (index + 1 >= pool.length) {
      finish(rs);
    } else {
      setResults(rs);
      setIndex((i) => i + 1);
      resetCurrent();
    }
  };

  // ---- Setup ----------------------------------------------------------------
  if (phase === "setup") {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => begin(shuffle(questions).slice(0, 10))}>Quick 10</Button>
          <Button variant="secondary" onClick={startWeakTopics}>
            Weak topics
          </Button>
        </div>

        <Card className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-fg">Topics</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => {
                const on = selectedTopics.has(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setSelectedTopics((prev) => {
                        const n = new Set(prev);
                        if (n.has(t)) n.delete(t);
                        else n.add(t);
                        return n;
                      })
                    }
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      on ? "bg-primary text-on-primary" : "bg-surface-2 text-fg-muted hover:text-fg",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-fg-faint">
              {selectedTopics.size === 0 ? "All topics" : `${selectedTopics.size} selected`}
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-fg">Difficulty</p>
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                    {d}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-fg">Count</p>
              <div className="flex gap-1.5">
                {COUNTS.map((c) => (
                  <Chip key={c} active={count === c} onClick={() => setCount(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={startFromSetup} size="lg" className="w-full">
            Start quiz
          </Button>
        </Card>
      </div>
    );
  }

  // ---- Done -----------------------------------------------------------------
  if (phase === "done") {
    const total = results.length;
    const correct = results.filter((r) => r.correct).length;
    const byTopic = tallyByTopic(results);
    const missedIds = new Set(results.filter((r) => !r.correct).map((r) => r.id));
    const missed = pool.filter((q) => missedIds.has(q.id));

    return (
      <div className="space-y-5">
        <Card className="text-center">
          <p className="text-sm text-fg-muted">Score</p>
          <p className="text-4xl font-bold text-fg">
            {correct}
            <span className="text-xl text-fg-faint"> / {total}</span>
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {total > 0 ? Math.round((correct / total) * 100) : 0}% correct
          </p>
        </Card>

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

        <div className="flex flex-wrap gap-2">
          {missed.length > 0 && (
            <Button onClick={() => begin(missed)}>Drill {missed.length} missed</Button>
          )}
          <Button variant="secondary" onClick={() => setPhase("setup")}>
            New quiz
          </Button>
        </div>
      </div>
    );
  }

  // ---- Running --------------------------------------------------------------
  const q = pool[index];
  const hasResponse = Array.isArray(response)
    ? response.length > 0
    : typeof response === "string"
      ? response.trim().length > 0
      : false;
  const canAdvance = revealed && (isAutoGraded(q.type) || selfCorrect != null);

  return (
    <div className="space-y-5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${((index + (revealed ? 1 : 0)) / pool.length) * 100}%` }}
        />
      </div>

      <Card>
        <QuestionCard
          question={q}
          response={response}
          onResponse={setResponse}
          revealed={revealed}
          selfCorrect={selfCorrect}
          onSelfGrade={setSelfCorrect}
          index={index}
          total={pool.length}
        />
      </Card>

      <div className="flex justify-end gap-2">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)} disabled={!hasResponse}>
            Check answer
          </Button>
        ) : (
          <Button onClick={next} disabled={!canAdvance}>
            {index + 1 >= pool.length ? "Finish" : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
        active ? "bg-surface-3 text-fg" : "bg-surface-2 text-fg-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
