'use client';

import Link from 'next/link';
import type { Lang, Pattern } from '@/data/patterns';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ProgressBadge from '@/components/ui/ProgressBadge';

export default function PatternCard({ pattern, lang }: { pattern: Pattern; lang: Lang }) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="surface-hover group flex items-center justify-between gap-4 rounded-md border border-transparent bg-light-surface px-4 py-3 hover:border-light-accent/40 hover:bg-light-surface2 dark:bg-dark-surface dark:hover:border-dark-accent/40 dark:hover:bg-dark-surface2"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-light-muted dark:text-dark-muted">{String(pattern.number).padStart(2, '0')}</span>
          <span className="font-medium">{pattern.name[lang]}</span>
          <CategoryBadge category={pattern.category} lang={lang} />
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-light-muted dark:text-dark-muted">{pattern.oneliner[lang]}</p>
      </div>
      <ProgressBadge slug={pattern.slug} compact />
    </Link>
  );
}
