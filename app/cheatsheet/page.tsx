'use client';

import { ExternalLink, Printer } from 'lucide-react';
import { useState } from 'react';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CategoryBadge from '@/components/ui/CategoryBadge';

export default function CheatSheetPage() {
  const { lang, t } = useLang();
  const [view, setView] = useState<'app' | 'professor'>('app');

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="no-print flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-light-accent dark:text-dark-accent">cheatsheet/print</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('sheet.title')}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {view === 'app' ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white dark:bg-dark-accent dark:text-dark-bg"
            >
              <Printer className="h-4 w-4" /> {t('sheet.print')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.open('/designpatternscard.pdf', '_blank')}
              className="inline-flex items-center gap-2 rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white dark:bg-dark-accent dark:text-dark-bg"
            >
              <ExternalLink className="h-4 w-4" /> {t('sheet.professorOpen')}
            </button>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div className="no-print flex gap-1 rounded-md bg-light-surface p-1 dark:bg-dark-surface w-fit">
        <button
          type="button"
          onClick={() => setView('app')}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            view === 'app'
              ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg'
              : 'text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text'
          }`}
        >
          {t('sheet.tabApp')}
        </button>
        <button
          type="button"
          onClick={() => setView('professor')}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            view === 'professor'
              ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg'
              : 'text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text'
          }`}
        >
          {t('sheet.tabProfessor')}
        </button>
      </div>

      <h1 className="print-only mb-4 text-2xl font-bold">CTS Quick Reference</h1>

      {view === 'app' ? (
        <div className="overflow-x-auto rounded-md bg-light-surface dark:bg-dark-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3">{t('sheet.colName')}</th>
                <th className="px-4 py-3">{t('sheet.colCategory')}</th>
                <th className="px-4 py-3">{t('sheet.colOneliner')}</th>
                <th className="px-4 py-3">{t('sheet.colKeyword')}</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern) => (
                <tr key={pattern.slug} className="border-t border-light-border/70 dark:border-dark-border/70">
                  <td className="px-4 py-3 font-mono">
                    {pattern.number}. {pattern.name[lang]}
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={pattern.category} lang={lang} />
                  </td>
                  <td className="px-4 py-3 text-light-muted dark:text-dark-muted">{pattern.oneliner[lang]}</td>
                  <td className="px-4 py-3 font-mono text-xs text-light-keyword dark:text-dark-keyword">{pattern.examKeywords[0][lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-print overflow-hidden rounded-md border border-light-border dark:border-dark-border">
          <iframe
            src="/designpatternscard.pdf"
            title="Professor's Design Patterns Reference"
            className="w-full"
            style={{ height: '80vh', minHeight: '600px' }}
          />
        </div>
      )}
    </div>
  );
}
