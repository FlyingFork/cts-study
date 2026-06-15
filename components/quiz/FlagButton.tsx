'use client';

import { Flag } from 'lucide-react';
import { useLang } from '@/lib/context/LangContext';

export default function FlagButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const { lang } = useLang();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-sm ${
        active
          ? 'border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-300'
          : 'border-light-border bg-light-surface text-light-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted'
      }`}
    >
      <Flag className="h-4 w-4" />
      {lang === 'ro' ? 'Marcheaza' : 'Flag'}
    </button>
  );
}
