'use client';

import type { QuizSession } from '@/types/quiz';

export default function NavigationGrid({
  session,
  currentIndex,
  onSelect,
}: {
  session: QuizSession;
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-md border border-light-border bg-light-bg p-3 dark:border-dark-border dark:bg-dark-bg md:grid md:grid-cols-10">
      {session.questionIds.map((id, index) => {
        const answered = Boolean(session.answers[id]);
        const flagged = session.flaggedIds.includes(id);
        const current = index === currentIndex;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-11 min-w-11 rounded-md border text-sm font-semibold transition ${
              flagged
                ? 'border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-300'
                : answered
                  ? 'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent dark:text-dark-bg'
                  : 'border-light-border bg-light-surface text-light-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted'
            } ${current ? 'ring-2 ring-light-text dark:ring-dark-text' : ''}`}
            aria-label={`Question ${index + 1}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
