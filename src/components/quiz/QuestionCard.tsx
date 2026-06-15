"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons";
import { Markdown } from "@/components/lesson/Markdown";
import type { Difficulty } from "@/lib/schema";
import { isCorrect, shuffle } from "./grade";
import { isAutoGraded, type QResponse, type RenderableQuestion } from "./types";

const DIFF_TONE: Record<Difficulty, "success" | "warning" | "danger"> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

function QCode({ html, code }: { html?: string; code?: string }) {
  if (!code) return null;
  if (html)
    return (
      <div
        className="my-3 overflow-x-auto rounded-xl text-sm [&_pre]:m-0 [&_pre]:rounded-xl [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  return (
    <pre className="my-3 overflow-x-auto rounded-xl bg-surface-2 p-4 font-mono text-sm text-fg">
      {code}
    </pre>
  );
}

export interface QuestionCardProps {
  question: RenderableQuestion;
  response: QResponse;
  onResponse: (r: QResponse) => void;
  revealed: boolean;
  disabled?: boolean;
  selfCorrect?: boolean | null;
  onSelfGrade?: (correct: boolean) => void;
  index?: number;
  total?: number;
}

export function QuestionCard({
  question: q,
  response,
  onResponse,
  revealed,
  disabled,
  selfCorrect = null,
  onSelfGrade,
  index,
  total,
}: QuestionCardProps) {
  const rights = useMemo(
    () => shuffle((q.matchPairs ?? []).map((p) => p.right)),
    [q.matchPairs],
  );
  const locked = disabled || revealed;
  const correct = revealed ? isCorrect(q, response, selfCorrect) : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
        {index != null && total != null && (
          <span className="font-medium text-fg">
            Q{index + 1} <span className="text-fg-faint">/ {total}</span>
          </span>
        )}
        <span>{q.topic}</span>
        <Badge tone={DIFF_TONE[q.difficulty]}>{q.difficulty}</Badge>
        {q.answerConfidence === "unknown" && (
          <Badge tone="neutral">unverified — practice only</Badge>
        )}
      </div>

      <Markdown>{q.prompt}</Markdown>
      <QCode html={q.codeHtml} code={q.code} />

      {q.type === "mcq" && (
        <Options
          options={q.options ?? []}
          selected={typeof response === "string" ? [response] : []}
          multi={false}
          locked={locked}
          answer={q.answer}
          revealed={revealed}
          onToggle={(opt) => onResponse(opt)}
        />
      )}

      {q.type === "multi" && (
        <Options
          options={q.options ?? []}
          selected={Array.isArray(response) ? response : []}
          multi
          locked={locked}
          answer={q.answer}
          revealed={revealed}
          onToggle={(opt) => {
            const cur = Array.isArray(response) ? response : [];
            onResponse(cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
          }}
        />
      )}

      {q.type === "matching" && (
        <div className="space-y-2">
          {(q.matchPairs ?? []).map((pair, i) => {
            const cur = Array.isArray(response) ? response : [];
            return (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="min-w-[40%] flex-1 text-sm text-fg">{pair.left}</span>
                <select
                  disabled={locked}
                  value={cur[i] ?? ""}
                  onChange={(e) => {
                    const next = [...cur];
                    next[i] = e.target.value;
                    onResponse(next);
                  }}
                  className="h-10 flex-1 rounded-lg border border-border bg-surface-2 px-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Choose…</option>
                  {rights.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {revealed && (
                  <span className="text-xs text-fg-muted">→ {pair.right}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(q.type === "predict-output" ||
        q.type === "fill-blank" ||
        q.type === "spot-the-bug" ||
        q.type === "short-answer") && (
        <textarea
          disabled={locked}
          value={typeof response === "string" ? response : ""}
          onChange={(e) => onResponse(e.target.value)}
          rows={3}
          placeholder="Type your answer…"
          className="w-full rounded-xl border border-border bg-surface-2 p-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      )}

      {revealed && (
        <div className="space-y-3 border-t border-border pt-3">
          {q.answerConfidence === "unknown" ? (
            <p className="text-sm font-medium text-fg-muted">
              Practice only - this source item has no reliable answer key and is not counted.
            </p>
          ) : isAutoGraded(q.type) ? (
            <Verdict correct={!!correct} />
          ) : selfCorrect == null && onSelfGrade ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-fg">Model answer</p>
              <p className="text-sm text-fg-muted">
                {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelfGrade(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success/15 px-3 text-sm font-medium text-success"
                >
                  <CheckCircleIcon className="text-base" /> I was right
                </button>
                <button
                  type="button"
                  onClick={() => onSelfGrade(false)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-danger/15 px-3 text-sm font-medium text-danger"
                >
                  <XCircleIcon className="text-base" /> I missed it
                </button>
              </div>
            </div>
          ) : (
            <Verdict correct={!!correct} />
          )}

          {q.explanation && (
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                Explanation
              </p>
              <Markdown>{q.explanation}</Markdown>
            </div>
          )}
          {q.source && <p className="text-xs text-fg-faint">Source: {q.source}</p>}
        </div>
      )}
    </div>
  );
}

function Verdict({ correct }: { correct: boolean }) {
  return correct ? (
    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
      <CheckCircleIcon className="text-lg" /> Correct
    </p>
  ) : (
    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-danger">
      <XCircleIcon className="text-lg" /> Incorrect
    </p>
  );
}

function Options({
  options,
  selected,
  multi,
  locked,
  answer,
  revealed,
  onToggle,
}: {
  options: string[];
  selected: string[];
  multi: boolean;
  locked: boolean;
  answer: string | string[];
  revealed: boolean;
  onToggle: (opt: string) => void;
}) {
  const answers = Array.isArray(answer) ? answer : [answer];
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        const isAnswer = answers.includes(opt);
        const tone = revealed
          ? isAnswer
            ? "correct"
            : isSelected
              ? "wrong"
              : "neutral"
          : isSelected
            ? "selected"
            : "neutral";
        return (
          <button
            key={opt}
            type="button"
            disabled={locked}
            onClick={() => onToggle(opt)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
              tone === "neutral" && "border-border bg-surface-2 text-fg hover:bg-surface-3",
              tone === "selected" && "border-primary bg-primary/10 text-fg",
              tone === "correct" && "border-success bg-success/10 text-fg",
              tone === "wrong" && "border-danger bg-danger/10 text-fg",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "grid h-5 w-5 flex-none place-items-center border text-[0.6rem]",
                multi ? "rounded" : "rounded-full",
                tone === "correct" && "border-success text-success",
                tone === "wrong" && "border-danger text-danger",
                tone === "selected" && "border-primary text-primary",
                tone === "neutral" && "border-border-strong text-transparent",
              )}
            >
              {revealed && isAnswer ? "✓" : isSelected ? "•" : ""}
            </span>
            <span className="min-w-0 flex-1">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
