'use client';

import { ChevronLeft, ChevronRight, ChevronsDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Pattern } from '@/data/patterns';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CodeBlock from '@/components/patterns/CodeBlock';
import StepIndicator from './StepIndicator';

export default function WalkthroughPlayer({ pattern }: { pattern: Pattern }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const { lang, t } = useLang();
  const step = pattern.codeWalkthrough[stepIndex];
  const codeRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  const scrollToHighlight = () => {
    const firstHighlighted = codeRef.current?.querySelector('[data-highlighted]');
    firstHighlighted?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToHighlight();
  }, [stepIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCardVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const goToPrev = () => setStepIndex((v) => Math.max(0, v - 1));
  const goToNext = () => setStepIndex((v) => Math.min(pattern.codeWalkthrough.length - 1, v + 1));
  const total = pattern.codeWalkthrough.length;

  return (
    <div className="min-w-0 pb-20 space-y-5 lg:pb-0">
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
        <section ref={sectionRef} className="rounded-md bg-light-surface p-5 dark:bg-dark-surface lg:sticky lg:top-20 lg:self-start">
          <StepIndicator current={stepIndex + 1} total={total} />
          <div className="mt-6">
            <span className={`font-mono text-xs font-bold ${step.roleColor}`}>{step.roleName}</span>
            <h1 className="mt-2 text-2xl font-semibold">{step.title[lang]}</h1>
            <p className="mt-4 text-base leading-7 text-light-muted dark:text-dark-muted lg:text-sm">{step.description[lang]}</p>
            <p className="mt-5 font-mono text-xs text-light-muted dark:text-dark-muted">
              {t('walk.step', { n: stepIndex + 1, total })}
            </p>
          </div>
          {/* Desktop nav buttons (hidden on mobile — replaced by fixed bottom bar) */}
          <div className="mt-8 hidden gap-2 lg:flex">
            <button
              type="button"
              onClick={goToPrev}
              disabled={stepIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-light-bg px-3 py-2 text-sm disabled:opacity-40 dark:bg-dark-bg"
            >
              <ChevronLeft className="h-4 w-4" /> {t('walk.prev')}
            </button>
            <button
              type="button"
              onClick={goToNext}
              disabled={stepIndex === total - 1}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-light-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-dark-accent dark:text-dark-bg"
            >
              {t('walk.next')} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
        <div ref={codeRef} className="min-w-0">
          {/* Step description strip — mobile only, shown only when main card is scrolled off screen */}
          <div className={`sticky top-16 z-30 mb-3 rounded-md bg-light-surface p-3 shadow-sm dark:bg-dark-surface lg:hidden ${cardVisible ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <span className={`font-mono text-xs font-bold ${step.roleColor}`}>{step.roleName}</span>
              <span className="font-mono text-xs text-light-muted dark:text-dark-muted">{t('walk.step', { n: stepIndex + 1, total })}</span>
            </div>
            <p className="mt-1 text-sm font-semibold">{step.title[lang]}</p>
            <p className="mt-1 text-xs leading-5 text-light-muted dark:text-dark-muted">{step.description[lang]}</p>
          </div>
          {/* Jump-to-highlight button — mobile only */}
          <div className="mb-2 flex justify-end lg:hidden">
            <button
              type="button"
              onClick={scrollToHighlight}
              className="inline-flex items-center gap-1.5 rounded-md bg-light-surface px-3 py-1.5 text-xs text-light-muted dark:bg-dark-surface dark:text-dark-muted"
            >
              <ChevronsDown className="h-3.5 w-3.5" /> Jump to highlight
            </button>
          </div>
          <CodeBlock code={pattern.code} fileName={pattern.codeFile} highlightLines={step.highlightLines} />
        </div>
      </div>

      {/* Fixed bottom nav bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-light-border/70 bg-light-bg/95 p-3 backdrop-blur dark:border-dark-border/70 dark:bg-dark-bg/95 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            disabled={stepIndex === 0}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-light-surface px-3 py-2.5 text-sm disabled:opacity-40 dark:bg-dark-surface"
          >
            <ChevronLeft className="h-4 w-4" /> {t('walk.prev')}
          </button>
          <span className="shrink-0 font-mono text-xs text-light-muted dark:text-dark-muted">
            {stepIndex + 1}/{total}
          </span>
          <button
            type="button"
            onClick={goToNext}
            disabled={stepIndex === total - 1}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-light-accent px-3 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-dark-accent dark:text-dark-bg"
          >
            {t('walk.next')} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
