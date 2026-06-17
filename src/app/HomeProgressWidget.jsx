'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { getFlashcardProgress } from '@/lib/flashcardProgress';
import { getExamHistory, getQuestionProgressSummary } from '@/lib/progress';

function formatExamScore(attempt) {
  if (!attempt) {
    return null;
  }

  const percentage = attempt.total > 0
    ? Math.round((attempt.score / attempt.total) * 100)
    : 0;

  return `${attempt.score}/${attempt.total} (${percentage}%)`;
}

function readHomeProgress() {
  const questionSummary = getQuestionProgressSummary();
  const examHistory = getExamHistory();
  const flashcardProgress = getFlashcardProgress();
  const flashcardsKnown = Object.values(flashcardProgress).filter((entry) => {
    return entry?.status === 'known';
  }).length;
  const lastExamScore = formatExamScore(examHistory[0]);

  return {
    ...questionSummary,
    flashcardsKnown,
    lastExamScore,
    hasHistory: questionSummary.totalAnswered > 0 || flashcardsKnown > 0 || Boolean(lastExamScore),
  };
}

const STATS = [
  { key: 'totalAnswered', label: 'Questions answered', color: 'text-[var(--color-accent)]' },
  { key: 'accuracy', label: 'Overall accuracy', format: (v) => `${v}%`, color: 'text-[var(--color-success)]' },
  { key: 'lastExamScore', label: 'Last mock exam', fallback: '—', color: 'text-[var(--color-warning)]' },
  { key: 'flashcardsKnown', label: 'Flashcards known', color: 'text-[var(--color-creational)]' },
];

export default function HomeProgressWidget() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(readHomeProgress());
  }, []);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Your Progress
        </h2>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Saved on this browser.
        </p>
      </div>

      {!progress ? (
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Loading your saved progress...
        </p>
      ) : progress.hasHistory ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ key, label, format, fallback, color }) => {
            const raw = progress[key];
            const display = raw == null || raw === null
              ? (fallback ?? '—')
              : format
                ? format(raw)
                : String(raw);

            return (
              <div key={key} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
                <p className={`text-3xl font-bold font-[family-name:var(--font-display)] ${color}`}>
                  {display}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No progress yet" className="bg-[var(--color-bg)]" asCard={false}>
          Start a practice session, review flashcards, or take a mock exam to see your stats here.
        </EmptyState>
      )}
    </Card>
  );
}
