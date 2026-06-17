'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import { categoryVariant } from '@/lib/categories';

const CATEGORY_STRIPE = {
  Creational: 'stripe-creational',
  Structural: 'stripe-structural',
  Behavioral: 'stripe-behavioral',
};

const SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'analogy', label: 'Analogy' },
  { id: 'structure', label: 'Structure & Code' },
  { id: 'usage', label: 'When to Use' },
  { id: 'exam', label: 'Exam Prep' },
];

// Combined height of the sticky top nav (56px) + sticky section bar (~52px) + breathing room
const SCROLL_OFFSET = 128;

// Highlights exam signal keywords in prose text
function HighlightText({ text, terms = [] }) {
  if (!terms.length) return <>{text}</>;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="rounded bg-[#7c8ffc]/20 px-0.5 font-semibold not-italic text-[var(--color-accent)]"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

function sameAnswers(selected, correct) {
  return selected.length === correct.length && correct.every((a) => selected.includes(a));
}

function getQuestionState(states, questionId) {
  return states[questionId] || { selected: [], graded: false };
}

function QuickCheck({ questions }) {
  const [questionStates, setQuestionStates] = useState({});

  if (questions.length < 2) {
    return (
      <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
        <EmptyState title="Quick check is not ready yet" badge={`${questions.length} tagged`} asCard={false}>
          This pattern needs at least two tagged multiple-choice questions before the quick check is useful.
        </EmptyState>
      </div>
    );
  }

  function selectSingle(question, option) {
    setQuestionStates((current) => ({
      ...current,
      [question.id]: { selected: [option], graded: true },
    }));
  }

  function toggleMulti(question, option) {
    setQuestionStates((current) => {
      const state = getQuestionState(current, question.id);
      const selected = state.selected.includes(option)
        ? state.selected.filter((item) => item !== option)
        : [...state.selected, option];
      return { ...current, [question.id]: { selected, graded: false } };
    });
  }

  function gradeMulti(question) {
    setQuestionStates((current) => {
      const state = getQuestionState(current, question.id);
      return { ...current, [question.id]: { ...state, graded: true } };
    });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">Quick check</h3>
        <p className="text-sm text-[var(--color-muted)]">
          Answer a few tagged questions and get immediate feedback.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((question, index) => {
          const state = getQuestionState(questionStates, question.id);
          const correctAnswers = Array.isArray(question.correctAnswers) ? question.correctAnswers : [];
          const isCorrect = state.graded && sameAnswers(state.selected, correctAnswers);

          return (
            <div
              key={question.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Question {index + 1}
                </p>
                <p className="text-sm leading-6 text-[var(--color-text)]">{question.questionText}</p>

                {question.codeSnippet ? (
                  <CodeBlock code={question.codeSnippet} className="text-xs leading-5" maxHeight="max-h-56" />
                ) : null}

                <div className="grid grid-cols-1 gap-2">
                  {question.options.map((option) => {
                    const selected = state.selected.includes(option);
                    const correctOption = correctAnswers.includes(option);
                    const gradedCorrect = state.graded && correctOption;
                    const gradedWrong = state.graded && selected && !correctOption;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (question.isMultiSelect) {
                            toggleMulti(question, option);
                          } else {
                            selectSingle(question, option);
                          }
                        }}
                        className={`min-h-[44px] rounded-lg border px-3 py-2 text-left text-sm leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                          gradedWrong
                            ? 'border-[var(--color-error)] bg-rose-950/40 text-rose-100'
                            : gradedCorrect
                              ? 'border-[var(--color-success)] bg-emerald-950/40 text-emerald-100'
                              : selected
                                ? 'border-[var(--color-accent)] bg-[var(--color-surface-2)] text-[var(--color-text)]'
                                : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {question.isMultiSelect ? (
                  <div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={state.selected.length === 0}
                      onClick={() => gradeMulti(question)}
                    >
                      Check answer
                    </Button>
                  </div>
                ) : null}

                {state.graded ? (
                  <div
                    className={`rounded-lg border p-3 text-sm leading-6 ${
                      isCorrect
                        ? 'border-[var(--color-success)] bg-emerald-950/30 text-emerald-100'
                        : 'border-[var(--color-error)] bg-rose-950/30 text-rose-100'
                    }`}
                  >
                    <p className="font-semibold">{isCorrect ? 'Correct' : 'Incorrect'}</p>
                    <p className="text-[var(--color-text)]">{question.explanation}</p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PatternDetailClient({ pattern, previousPattern, nextPattern, quickCheckQuestions }) {
  const stripeClass = CATEGORY_STRIPE[pattern.category] || '';
  const [activeSection, setActiveSection] = useState('problem');

  useEffect(() => {
    function updateActive() {
      let current = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 20) {
          current = id;
        }
      }
      setActiveSection(current);
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <>
      {/* Top content — back link + hero */}
      <Container className="pt-10 sm:pt-14 flex flex-col gap-8">
        <Link
          href="/patterns"
          className="w-fit rounded-md text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          ← Back to patterns
        </Link>

        <section className={`flex flex-col gap-4 rounded-lg p-5 sm:p-7 ${stripeClass}`}>
          <Badge variant={categoryVariant(pattern.category)} className="w-fit">
            {pattern.category}
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)]">
              {pattern.name}
            </h1>
            <p className="max-w-3xl text-lg leading-7 text-[var(--color-muted)]">{pattern.oneLiner}</p>
          </div>
        </section>
      </Container>

      {/* Sticky section jump bar — full viewport width, sits under the top nav */}
      <nav
        aria-label="Jump to section"
        className="sticky top-14 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm"
      >
        <Container className="py-2.5">
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className={`min-h-[36px] rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </Container>
      </nav>

      {/* Main content */}
      <Container className="pb-10 sm:pb-14 pt-10 flex flex-col gap-12">
        {/* The Problem */}
        <section id="problem" className="flex flex-col gap-3 border-l-2 border-[var(--color-warning)] pl-5">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-warning)]">⚠</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">The Problem</h2>
          </div>
          <p className="text-base leading-7 text-[var(--color-text)]">
            <HighlightText text={pattern.problem} terms={pattern.examSignals} />
          </p>
        </section>

        {/* The Solution */}
        <section id="solution" className="flex flex-col gap-3 border-l-2 border-[var(--color-accent)] pl-5">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-accent)]">✓</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">The Solution</h2>
          </div>
          <p className="text-base leading-7 text-[var(--color-text)]">
            <HighlightText text={pattern.solution} terms={pattern.examSignals} />
          </p>
        </section>

        {/* Analogy callout */}
        <section
          id="analogy"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 sm:p-6"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Think of it like this
          </p>
          <p className="text-base leading-7 italic text-[var(--color-text)]">"{pattern.analogy}"</p>
        </section>

        {/* Structure + Code */}
        <section id="structure" className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">How it's built</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Pattern roles</p>
              <div className="flex flex-col gap-2">
                {pattern.structure.map((item, index) => (
                  <div
                    key={item.role}
                    className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7c8ffc]/20 text-xs font-bold text-[var(--color-accent)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-text)]">
                        {item.role}
                      </p>
                      <p className="mt-0.5 text-sm leading-5 text-[var(--color-muted)]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Java example</p>
              <CodeBlock code={pattern.javaExample} />
            </div>
          </div>
        </section>

        {/* When to use */}
        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">When to use</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-success)] bg-emerald-950/20 p-4">
              <h3 className="text-base font-semibold text-emerald-100">Use it when…</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {pattern.whenToUse.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-text)]">
                    <span className="mt-0.5 font-bold text-[var(--color-success)]">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--color-error)] bg-rose-950/20 p-4">
              <h3 className="text-base font-semibold text-rose-100">Avoid it when…</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {pattern.whenNotToUse.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-text)]">
                    <span className="mt-0.5 font-bold text-[var(--color-error)]">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Exam prep */}
        <section id="exam" className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Exam prep</h2>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Don't confuse with
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {pattern.confusedWith.map((item) => (
                <div
                  key={item.pattern}
                  className="rounded-lg border border-[var(--color-warning)] bg-amber-950/20 p-4"
                >
                  <p className="text-sm font-semibold text-amber-100">Not {item.pattern}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">{item.distinction}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-surface-2)] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Look for these words
            </p>
            <div className="flex flex-wrap gap-2">
              {pattern.examSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-[var(--color-accent)] bg-[var(--color-bg)] px-3 py-1 font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <QuickCheck questions={quickCheckQuestions} />
        </section>

        {/* Previous / Next navigation */}
        <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={`/patterns/${previousPattern.slug}`}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">← Previous</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{previousPattern.name}</p>
          </Link>
          <Link
            href={`/patterns/${nextPattern.slug}`}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:text-right"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Next →</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{nextPattern.name}</p>
          </Link>
        </nav>
      </Container>
    </>
  );
}
