'use client';

import Link from 'next/link';
import { ArrowRight, Brain, CheckCircle2, GitCompare, Library, Route, Layers, Zap, ScanSearch, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLang } from '@/lib/context/LangContext';

const quickActions = [
  { href: '/flashcards', icon: <Zap className="h-4 w-4" />, labelKey: 'nav.flashcards', hintKey: 'home.quickActions.flashcards.hint' },
  { href: '/quiz', icon: <ScanSearch className="h-4 w-4" />, labelKey: 'nav.quiz', hintKey: 'home.quickActions.quiz.hint' },
  { href: '/compare', icon: <GitCompare className="h-4 w-4" />, labelKey: 'nav.compare', hintKey: 'home.quickActions.compare.hint' },
  { href: '/walkthrough/adapter', icon: <Layers className="h-4 w-4" />, labelKey: 'nav.walkthrough', hintKey: 'home.quickActions.walkthrough.hint' },
  { href: '/cheatsheet', icon: <FileText className="h-4 w-4" />, labelKey: 'nav.cheatsheet', hintKey: 'home.quickActions.cheatsheet.hint' },
] as const;

function GuideCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="surface-hover rounded-md bg-light-surface p-5 dark:bg-dark-surface">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-light-bg text-light-accent dark:bg-dark-bg dark:text-dark-accent">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted">{body}</p>
    </div>
  );
}

function LearningStep({ number, title, body, isLast }: { number: number; title: string; body: string; isLast: boolean }) {
  return (
    <li className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-4">
      <div className="relative flex justify-center">
        {!isLast && <span className="absolute top-11 h-[calc(100%+0.75rem)] w-px bg-light-border dark:bg-dark-border" aria-hidden="true" />}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-light-accent font-mono text-sm font-semibold text-white shadow-sm dark:bg-dark-accent dark:text-dark-bg">
          {number}
        </div>
      </div>
      <div className="surface-hover rounded-md border border-transparent bg-white p-4 shadow-sm hover:border-light-accent/40 dark:bg-dark-bg dark:hover:border-dark-accent/40">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-light-muted dark:text-dark-muted">{body}</p>
      </div>
    </li>
  );
}

export default function HomePage() {
  const { lang, t } = useLang();

  return (
    <div className="space-y-10">
      <section className="home-hero-panel grid gap-8 rounded-md p-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:p-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-light-accent dark:text-dark-accent">{t('home.subtitle')}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-5xl">{t('home.title')}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-light-muted dark:text-dark-muted">
            {lang === 'ro'
              ? 'Invata fiecare pattern prin intentie, apoi confirma intelegerea prin exemple, flashcard-uri si quiz-uri.'
              : 'Learn each pattern by intent first, then confirm understanding through examples, flashcards, and quizzes.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/patterns"
              className="inline-flex items-center gap-2 rounded-md bg-light-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-light-accent/90 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-dark-accent/90"
            >
              <Library className="h-4 w-4" />
              {t('home.cta.patterns')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:text-light-accent dark:bg-dark-bg dark:hover:text-dark-accent"
            >
              {t('home.cta.quiz')}
            </Link>
          </div>
        </div>

        <div className="surface-hover rounded-md border border-light-border/70 bg-white/88 p-5 shadow-sm backdrop-blur dark:border-dark-border/70 dark:bg-dark-bg/82">
          <h2 className="font-semibold">{t('home.understand.title')}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-light-muted dark:text-dark-muted">
            <li>{t('home.understand.intent')}</li>
            <li>{t('home.understand.roles')}</li>
            <li>{t('home.understand.signal')}</li>
            <li>{t('home.understand.code')}</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted">{t('home.quickActions.title')}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map(({ href, icon, labelKey, hintKey }) => (
            <Link
              key={href}
              href={href}
              className="group surface-hover flex flex-col gap-3 rounded-md border border-light-border bg-light-surface p-4 transition hover:border-light-accent/50 dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-light-bg text-light-muted transition-colors group-hover:text-light-accent dark:bg-dark-bg dark:text-dark-muted dark:group-hover:text-dark-accent">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug">{t(labelKey)}</p>
                <p className="mt-0.5 text-xs text-light-muted dark:text-dark-muted">{t(hintKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('home.how.title')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <GuideCard icon={<Route className="h-5 w-5" />} title={t('home.how.learn.title')} body={t('home.how.learn.body')} />
          <GuideCard icon={<Brain className="h-5 w-5" />} title={t('home.how.recall.title')} body={t('home.how.recall.body')} />
          <GuideCard icon={<GitCompare className="h-5 w-5" />} title={t('home.how.compare.title')} body={t('home.how.compare.body')} />
        </div>
      </section>

      <section className="rounded-md bg-light-surface p-5 dark:bg-dark-surface md:p-6">
        <div className="flex items-start gap-3 border-b border-light-border pb-5 dark:border-dark-border">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-bg text-light-accent dark:bg-dark-bg dark:text-dark-accent">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">{t('home.learnFlow.title')}</h2>
            <p className="mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted">{t('home.learnFlow.subtitle')}</p>
          </div>
        </div>
        <ol className="mt-5 max-w-3xl space-y-3">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <LearningStep
              key={step}
              number={step}
              isLast={step === 6}
              title={t(`home.learnFlow.step${step}.title`)}
              body={t(`home.learnFlow.step${step}.body`)}
            />
          ))}
        </ol>
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-md bg-light-surface p-5 dark:bg-dark-surface md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">{t('home.library')}</h2>
          <p className="mt-1 text-sm text-light-muted dark:text-dark-muted">{t('home.libraryHint')}</p>
        </div>
        <Link
          href="/patterns"
          className="inline-flex items-center gap-2 rounded-md bg-light-bg px-4 py-2 text-sm font-semibold transition hover:text-light-accent dark:bg-dark-bg dark:hover:text-dark-accent"
        >
          {t('home.cta.patterns')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
