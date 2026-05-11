'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Pattern } from '@/data/patterns';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CodeBlock from '@/components/patterns/CodeBlock';
import StepIndicator from './StepIndicator';

export default function WalkthroughPlayer({ pattern }: { pattern: Pattern }) {
  const [stepIndex, setStepIndex] = useState(0);
  const { lang, t } = useLang();
  const step = pattern.codeWalkthrough[stepIndex];
  const codeRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const firstHighlighted = codeRef.current?.querySelector('[data-highlighted]');
    firstHighlighted?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [stepIndex]);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="min-w-0">
          <label className="mb-2 block text-sm font-medium text-light-accent dark:text-dark-accent" htmlFor="pattern-walkthrough">
            {t('nav.walkthrough')}
          </label>
          <select
            id="pattern-walkthrough"
            value={pattern.slug}
            onChange={(event) => {
              window.location.href = `/walkthrough/${event.target.value}`;
            }}
            className="h-10 w-full max-w-full rounded-md border border-transparent bg-light-surface px-3 dark:bg-dark-surface sm:w-auto"
          >
            {patterns.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name[lang]}
              </option>
            ))}
          </select>
        </div>
        <Link
          href={`/patterns/${pattern.slug}`}
          className="inline-flex w-full justify-center rounded-md bg-light-surface px-3 py-2 text-sm dark:bg-dark-surface sm:w-auto"
        >
          {t('walk.finish')}
        </Link>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <section className="rounded-md bg-light-surface p-5 dark:bg-dark-surface lg:sticky lg:top-20 lg:self-start">
          <StepIndicator current={stepIndex + 1} total={pattern.codeWalkthrough.length} />
          <div className="mt-6">
            <span className={`font-mono text-xs font-bold ${step.roleColor}`}>{step.roleName}</span>
            <h1 className="mt-2 text-2xl font-semibold">{step.title[lang]}</h1>
            <p className="mt-4 leading-7 text-light-muted dark:text-dark-muted">{step.description[lang]}</p>
            <p className="mt-5 font-mono text-xs text-light-muted dark:text-dark-muted">
              {t('walk.step', { n: stepIndex + 1, total: pattern.codeWalkthrough.length })}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
              disabled={stepIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-light-bg px-3 py-2 text-sm disabled:opacity-40 dark:bg-dark-bg"
            >
              <ChevronLeft className="h-4 w-4" /> {t('walk.prev')}
            </button>
            <button
              type="button"
              onClick={() => setStepIndex((value) => Math.min(pattern.codeWalkthrough.length - 1, value + 1))}
              disabled={stepIndex === pattern.codeWalkthrough.length - 1}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-light-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-dark-accent dark:text-dark-bg"
            >
              {t('walk.next')} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
        <div ref={codeRef} className="min-w-0">
          <CodeBlock code={pattern.code} fileName={pattern.codeFile} highlightLines={step.highlightLines} />
        </div>
      </div>
    </div>
  );
}
