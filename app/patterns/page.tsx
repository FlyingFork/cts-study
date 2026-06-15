'use client';

import Link from 'next/link';
import { ArrowLeft, Library } from 'lucide-react';
import { useCallback, useState } from 'react';
import { patterns, type Pattern } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import AiCourseExport from '@/components/patterns/AiCourseExport';
import PatternCard from '@/components/patterns/PatternCard';
import SearchBar from '@/components/ui/SearchBar';

export default function PatternsPage() {
  const { lang, t } = useLang();
  const [results, setResults] = useState<Pattern[]>(patterns);
  const onResults = useCallback((next: Pattern[]) => setResults(next), []);
  const structural = results.filter((pattern) => pattern.category === 'structural');
  const behavioral = results.filter((pattern) => pattern.category === 'behavioral');

  return (
    <div className="space-y-8">
      <section className="home-hero-panel rounded-md p-6 lg:p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-light-muted hover:text-light-accent dark:text-dark-muted dark:hover:text-dark-accent">
          <ArrowLeft className="h-4 w-4" />
          {t('patterns.backHome')}
        </Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-light-accent dark:text-dark-accent">
              <Library className="h-5 w-5" />
              <span className="text-sm font-medium">10 patterns</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">{t('patterns.title')}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-light-muted dark:text-dark-muted">{t('patterns.subtitle')}</p>
          </div>
          <div className="rounded-md border border-light-border bg-white p-2 shadow-sm dark:border-dark-border dark:bg-dark-bg">
            <SearchBar onResults={onResults} />
          </div>
        </div>
      </section>

      <AiCourseExport />

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 border-b border-light-border pb-4 dark:border-dark-border md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold">{t('home.library')}</h2>
            <p className="mt-2 text-sm text-light-muted dark:text-dark-muted">{t('home.libraryHint')}</p>
          </div>
          <p className="font-mono text-xs text-light-muted dark:text-dark-muted">{results.length}/10</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-light-muted dark:text-dark-muted">{t('home.structural')}</h3>
            <div className="space-y-2">
              {structural.map((pattern) => (
                <PatternCard key={pattern.slug} pattern={pattern} lang={lang} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-light-muted dark:text-dark-muted">{t('home.behavioral')}</h3>
            <div className="space-y-2">
              {behavioral.map((pattern) => (
                <PatternCard key={pattern.slug} pattern={pattern} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
