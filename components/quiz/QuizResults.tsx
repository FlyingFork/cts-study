'use client';

import { RotateCcw } from 'lucide-react';
import { useLang } from '@/lib/context/LangContext';

export default function QuizResults({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-xl rounded-md bg-light-surface p-8 text-center dark:bg-dark-surface">
      <h2 className="text-2xl font-semibold">{t('quiz.results')}</h2>
      <p className="mt-4 font-mono text-4xl text-light-accent dark:text-dark-accent">
        {score}/{total}
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white dark:bg-dark-accent dark:text-dark-bg"
      >
        <RotateCcw className="h-4 w-4" /> {t('quiz.restart')}
      </button>
    </div>
  );
}
