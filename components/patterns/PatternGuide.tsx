'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronDown, ClipboardList, HelpCircle, KeyRound, Lightbulb, ListChecks, Play, Quote, XCircle } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { LocalizedString, Pattern } from '@/data/patterns';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ProgressBadge from '@/components/ui/ProgressBadge';
import CodeBlock from './CodeBlock';
import ExamKeywords from './ExamKeywords';
import ParticipantsTable from './ParticipantsTable';
import PatternSelfTest from './PatternSelfTest';
import MermaidDiagram from './MermaidDiagram';
import { PatternTocDesktop, PatternTocMobile, type TocSection } from './PatternToc';
import { PATTERN_DIAGRAMS } from '@/data/diagrams';

function IntroCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="surface-hover rounded-md bg-light-surface p-5 dark:bg-dark-surface">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-light-bg text-light-accent dark:bg-dark-bg dark:text-dark-accent">
        {icon}
      </div>
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted">{children}</div>
    </div>
  );
}

function StudyOrder({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-light-bg font-mono text-xs font-semibold text-light-accent dark:bg-dark-bg dark:text-dark-accent">
            {index + 1}
          </span>
          <span className="pt-1 text-sm leading-6 text-light-muted dark:text-dark-muted">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function DetailSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <section className="surface-hover rounded-md bg-light-surface dark:bg-dark-surface">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown className={`h-4 w-4 text-light-muted transition dark:text-dark-muted ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-light-border px-5 py-5 dark:border-dark-border">{children}</div>}
    </section>
  );
}

function DecisionListCard({
  title,
  icon,
  items,
  tone,
  lang,
}: {
  title: string;
  icon: ReactNode;
  items: LocalizedString[];
  tone: 'positive' | 'negative' | 'neutral';
  lang: 'en' | 'ro';
}) {
  const borderColor =
    tone === 'positive'
      ? 'border-green-500/30 dark:border-green-500/20'
      : tone === 'negative'
        ? 'border-red-400/30 dark:border-red-400/20'
        : 'border-light-border dark:border-dark-border';
  const iconColor =
    tone === 'positive'
      ? 'text-green-600 dark:text-green-400'
      : tone === 'negative'
        ? 'text-red-500 dark:text-red-400'
        : 'text-light-accent dark:text-dark-accent';

  return (
    <div className={`rounded-md border bg-light-surface p-4 dark:bg-dark-surface ${borderColor}`}>
      <div className={`mb-3 flex items-center gap-2 ${iconColor}`}>
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.en} className="text-sm leading-6 text-light-text dark:text-dark-text">
            {item[lang]}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SolveExamplePanel({ pattern }: { pattern: Pattern }) {
  const { lang, t } = useLang();
  const ex = pattern.solveExample;

  return (
    <section className="space-y-4 rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-light-accent dark:text-dark-accent">
          <ClipboardList className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">{t('guide.solveExample')}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted">{t('guide.solveProblem')}</p>
          <p className="rounded-md bg-light-bg p-3 text-sm leading-6 italic text-light-text dark:bg-dark-bg dark:text-dark-text">{ex.problem[lang]}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted">{t('guide.solveKeywords')}</p>
          <div className="flex flex-wrap gap-2">
            {ex.keywords.map((kw) => (
              <span key={kw.en} className="rounded-md bg-light-accent/10 px-2 py-1 text-xs font-medium text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                {kw[lang]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted">{t('guide.solveReasoning')}</p>
          <ol className="space-y-1.5">
            {ex.reasoning.map((step, i) => (
              <li key={step.en} className="grid grid-cols-[20px_minmax(0,1fr)] gap-2 text-sm leading-6 text-light-text dark:text-dark-text">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-light-bg text-xs font-semibold text-light-accent dark:bg-dark-bg dark:text-dark-accent">
                  {i + 1}
                </span>
                <span>{step[lang]}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted">{t('guide.solveRoles')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {ex.roleMappings.map((rm) => (
                  <tr key={rm.role}>
                    <td className="py-2 pr-3 font-mono text-xs font-semibold text-light-accent dark:text-dark-accent">{rm.role}</td>
                    <td className="py-2 pr-3 font-medium text-light-text dark:text-dark-text">{rm.mappedTo}</td>
                    <td className="py-2 text-light-text dark:text-dark-text">{rm.explanation[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted">{t('guide.solveAnswer')}</p>
          <ol className="space-y-1.5">
            {ex.answerOutline.map((step, i) => (
              <li key={step.en} className="grid grid-cols-[20px_minmax(0,1fr)] gap-2 text-sm leading-6 text-light-text dark:text-dark-text">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-light-bg text-xs font-semibold text-light-accent dark:bg-dark-bg dark:text-dark-accent">
                  {i + 1}
                </span>
                <span>{step[lang]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function PatternGuide({ pattern }: { pattern: Pattern }) {
  const { lang, t } = useLang();
  const [openSection, setOpenSection] = useState('participants');
  const index = patterns.findIndex((item) => item.slug === pattern.slug);
  const prev = patterns[(index - 1 + patterns.length) % patterns.length];
  const next = patterns[(index + 1) % patterns.length];

  const diagram = PATTERN_DIAGRAMS[pattern.slug];

  const tocSections: TocSection[] = [
    { id: 'overview', label: t('toc.overview') },
    { id: 'decision', label: t('toc.decision') },
    { id: 'example', label: t('toc.example') },
    ...(diagram ? [{ id: 'uml', label: t('toc.uml') }] : []),
    { id: 'details', label: t('toc.details') },
    { id: 'selftest', label: t('toc.selftest') },
  ];

  return (
    <article className="mx-auto w-full">
      <PatternTocMobile sections={tocSections} />

      <div className="mt-10 grid grid-cols-1 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_176px] lg:gap-6">
        <div className="space-y-7">
          {/* ── Overview ── */}
          <div className="space-y-4" id="overview">
            <Link href="/patterns" className="inline-flex items-center gap-2 text-sm text-light-muted hover:text-light-accent dark:text-dark-muted dark:hover:text-dark-accent">
              <ArrowLeft className="h-4 w-4" /> {t('btn.backHome')}
            </Link>
            <section className="home-hero-panel rounded-md p-6 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-light-muted dark:text-dark-muted">#{String(pattern.number).padStart(2, '0')}</span>
                    <CategoryBadge category={pattern.category} lang={lang} />
                  </div>
                  <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">{pattern.name[lang]}</h1>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-light-muted dark:text-dark-muted">{pattern.oneliner[lang]}</p>
                </div>
                <div className="rounded-md border border-light-border/70 bg-white/85 p-4 shadow-sm dark:border-dark-border/70 dark:bg-dark-bg/80">
                  <p className="mb-3 text-sm font-semibold">{t('guide.studyOrderTitle')}</p>
                  <StudyOrder
                    steps={[
                      t('guide.studyOrder.step1'),
                      t('guide.studyOrder.step2'),
                      t('guide.studyOrder.step3'),
                      t('guide.studyOrder.step4'),
                    ]}
                  />
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ProgressBadge slug={pattern.slug} />
                    <Link
                      href={`/walkthrough/${pattern.slug}`}
                      className="inline-flex items-center gap-2 rounded-md bg-light-accent px-3 py-2 text-sm font-medium text-white dark:bg-dark-accent dark:text-dark-bg"
                    >
                      <Play className="h-4 w-4" /> {t('guide.walkthrough')}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            <IntroCard icon={<Lightbulb className="h-5 w-5" />} title={t('guide.ideaTitle')}>
              <p>{pattern.oneliner[lang]}</p>
            </IntroCard>
            <IntroCard icon={<BookOpen className="h-5 w-5" />} title={t('guide.analogyTitle')}>
              <p>{pattern.analogy[lang]}</p>
            </IntroCard>
            <IntroCard icon={<KeyRound className="h-5 w-5" />} title={t('guide.cluesTitle')}>
              <div>
                <ExamKeywords keywords={pattern.examKeywords} />
              </div>
            </IntroCard>
          </section>

          {/* ── Exam Decision ── */}
          <section className="space-y-4" id="decision">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-surface text-light-accent dark:bg-dark-surface dark:text-dark-accent">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{t('guide.examDecisionTitle')}</h2>
                <p className="mt-1 text-sm leading-6 text-light-muted dark:text-dark-muted">{t('guide.examDecisionHint')}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <DecisionListCard
                title={t('guide.useWhen')}
                icon={<CheckCircle2 className="h-4 w-4" />}
                items={pattern.useWhen}
                tone="positive"
                lang={lang}
              />
              <DecisionListCard
                title={t('guide.doNotUseWhen')}
                icon={<XCircle className="h-4 w-4" />}
                items={pattern.doNotUseWhen}
                tone="negative"
                lang={lang}
              />
              <DecisionListCard
                title={t('guide.examPhrases')}
                icon={<Quote className="h-4 w-4" />}
                items={pattern.examPhrases}
                tone="neutral"
                lang={lang}
              />
            </div>
          </section>

          {/* ── Solve Example ── */}
          <div id="example">
            <SolveExamplePanel pattern={pattern} />
          </div>

          {/* ── Professor's UML Diagram ── */}
          {diagram && (
            <section className="space-y-3" id="uml">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-surface text-light-accent dark:bg-dark-surface dark:text-dark-accent">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{t('guide.umlDiagram')}</h2>
                  <p className="mt-1 text-sm leading-6 text-light-muted dark:text-dark-muted">{t('guide.umlHint')}</p>
                </div>
              </div>
              <div className="rounded-md border border-light-border bg-light-surface p-4 dark:border-dark-border dark:bg-dark-surface">
                <MermaidDiagram diagram={diagram} />
              </div>
            </section>
          )}

          {/* ── Deep Dive ── */}
          <div className="space-y-3" id="details">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-surface text-light-accent dark:bg-dark-surface dark:text-dark-accent">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{t('guide.detailsTitle')}</h2>
                <p className="mt-1 text-sm leading-6 text-light-muted dark:text-dark-muted">{t('guide.detailsHint')}</p>
              </div>
            </div>

            <DetailSection id="participants" title={t('guide.participants')} open={openSection === 'participants'} onToggle={setOpenSection}>
              <ParticipantsTable participants={pattern.participants} />
            </DetailSection>

            <DetailSection id="structure" title={t('guide.structure')} open={openSection === 'structure'} onToggle={setOpenSection}>
              <pre className="overflow-x-auto rounded-md bg-light-bg p-4 font-mono text-sm leading-7 text-light-string dark:bg-dark-bg dark:text-dark-string">
                {pattern.structureDiagram}
              </pre>
            </DetailSection>

            <DetailSection id="code" title={t('guide.code')} open={openSection === 'code'} onToggle={setOpenSection}>
              <CodeBlock code={pattern.code} fileName={pattern.codeFile} />
            </DetailSection>

            <DetailSection id="mistakes" title={t('guide.mistakes')} open={openSection === 'mistakes'} onToggle={setOpenSection}>
              <ul className="space-y-2 text-sm leading-6 text-light-muted dark:text-dark-muted">
                {pattern.commonMistakes.map((mistake) => (
                  <li key={mistake.en} className="rounded-md bg-light-bg p-3 dark:bg-dark-bg">
                    {mistake[lang]}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection id="confused" title={t('guide.confusedWith')} open={openSection === 'confused'} onToggle={setOpenSection}>
              <div className="flex flex-wrap gap-2">
                {pattern.confusedWith.map((slug) => {
                  const related = patterns.find((item) => item.slug === slug);
                  if (!related) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/patterns/${slug}`}
                      className="rounded-md bg-light-bg px-3 py-2 text-sm hover:text-light-accent dark:bg-dark-bg dark:hover:text-dark-accent"
                    >
                      {related.name[lang]}
                    </Link>
                  );
                })}
              </div>
            </DetailSection>
          </div>

          {/* ── Self Test ── */}
          <section className="space-y-4" id="selftest">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-surface text-light-accent dark:bg-dark-surface dark:text-dark-accent">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{t('guide.selfTest')}</h2>
                <p className="mt-1 text-sm leading-6 text-light-muted dark:text-dark-muted">{t('guide.selfTestHint')}</p>
              </div>
            </div>
            <PatternSelfTest questions={pattern.selfTest} />
          </section>

          <nav className="no-print flex items-center justify-between border-t border-light-border pt-6 dark:border-dark-border">
            <Link href={`/patterns/${prev.slug}`} className="inline-flex items-center gap-2 rounded-md bg-light-surface px-3 py-2 text-sm dark:bg-dark-surface">
              <ArrowLeft className="h-4 w-4" /> {t('btn.prevPattern')}
            </Link>
            <Link href={`/patterns/${next.slug}`} className="inline-flex items-center gap-2 rounded-md bg-light-surface px-3 py-2 text-sm dark:bg-dark-surface">
              {t('btn.nextPattern')} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>

        {/* ── Desktop TOC rail ── */}
        <PatternTocDesktop sections={tocSections} />
      </div>
    </article>
  );
}
