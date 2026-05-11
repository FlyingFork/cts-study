'use client';

import { CheckCircle2, Circle, LoaderCircle } from 'lucide-react';
import type { ProgressStatus } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import { useProgress } from '@/lib/context/ProgressContext';

const styleByStatus: Record<ProgressStatus, string> = {
  'not-started': 'text-light-muted dark:text-dark-muted',
  studying: 'text-yellow-500',
  done: 'text-light-accent dark:text-dark-accent',
};

export default function ProgressBadge({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { getStatus, cycleStatus } = useProgress();
  const { t } = useLang();
  const status = getStatus(slug);
  const label = t(`progress.${status}`);
  const Icon = status === 'done' ? CheckCircle2 : status === 'studying' ? LoaderCircle : Circle;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        cycleStatus(slug);
      }}
      className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs transition hover:bg-light-surface2 dark:hover:bg-dark-surface2 ${styleByStatus[status]}`}
      aria-label={`${t('progress.mark')} ${label}`}
      title={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {!compact && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
