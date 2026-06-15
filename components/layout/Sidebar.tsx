'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import ProgressBadge from '@/components/ui/ProgressBadge';

export default function Sidebar() {
  const pathname = usePathname();
  const { lang } = useLang();

  return (
    <aside className="no-print hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 rounded-md border border-light-border bg-light-surface p-3 dark:border-dark-border dark:bg-dark-surface">
        <div className="mb-2 px-2 font-mono text-xs text-light-muted dark:text-dark-muted">patterns/</div>
        <nav className="space-y-1" aria-label="Pattern list">
          {patterns.map((pattern) => {
            const active = pathname === `/patterns/${pattern.slug}`;
            return (
              <Link
                href={`/patterns/${pattern.slug}`}
                key={pattern.slug}
                className={`flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm transition ${
                  active ? 'bg-light-surface2 text-light-accent dark:bg-dark-surface2 dark:text-dark-accent' : 'hover:bg-light-surface2 dark:hover:bg-dark-surface2'
                }`}
              >
                <span className="truncate">{String(pattern.number).padStart(2, '0')}_{pattern.name[lang]}</span>
                <ProgressBadge slug={pattern.slug} compact />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
