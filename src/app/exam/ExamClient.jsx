'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import QuizSession, { getCorrectAnswerText } from '@/components/quiz/QuizSession';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import { categoryVariant } from '@/lib/categories';
import { selectExamQuestions } from '@/lib/examSelector';
import { recordExamAttempt } from '@/lib/progress';

const PRESET_COUNTS = [20, 30, 40];
const WARNING_THRESHOLD = 60;

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function formatPercentage(score, total) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((score / total) * 100);
}

function buildTagRows({ results, questionsById, patternBySlug }) {
  const rowsByKey = new Map();

  for (const answer of results.answers || []) {
    const question = questionsById.get(answer.questionId);
    if (!question) {
      continue;
    }

    const tags = [
      ...(question.patterns || []).map((slug) => ({
        key: `pattern:${slug}`,
        label: patternBySlug.get(slug)?.name || slug,
        category: patternBySlug.get(slug)?.category || null,
        href: `/patterns/${slug}`,
      })),
      ...(question.topics || []).map((topic) => ({
        key: `topic:${topic}`,
        label: topic,
        category: null,
        href: null,
      })),
    ];

    for (const tag of tags) {
      const row = rowsByKey.get(tag.key) || {
        ...tag,
        correct: 0,
        total: 0,
      };

      row.total += 1;
      row.correct += answer.wasCorrect ? 1 : 0;
      rowsByKey.set(tag.key, row);
    }
  }

  return [...rowsByKey.values()].sort((left, right) => {
    const leftPercent = left.total > 0 ? left.correct / left.total : 0;
    const rightPercent = right.total > 0 ? right.correct / right.total : 0;

    if (leftPercent !== rightPercent) {
      return leftPercent - rightPercent;
    }

    if (left.total !== right.total) {
      return right.total - left.total;
    }

    return left.label.localeCompare(right.label);
  });
}

function PresetButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-[48px] rounded-lg border px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </button>
  );
}

function SetupScreen({ questionCount, selectedCount, setSelectedCount, onStart }) {
  const presetOptions = PRESET_COUNTS.filter((count) => count < questionCount);

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <section className="flex flex-col gap-3">
        <Badge variant="behavioral" className="w-fit">Mock exam</Badge>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Exam Mode
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
          Take a full mock exam covering everything, then see exactly where you&apos;re weak.
        </p>
      </section>

      <Card className="flex flex-col gap-6 p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Question count
          </h2>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Choose a preset size. The mock exam will balance question types and pattern categories.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {presetOptions.map((count) => (
            <PresetButton
              key={count}
              active={selectedCount === count}
              onClick={() => setSelectedCount(count)}
            >
              {count} questions
            </PresetButton>
          ))}
          <PresetButton
            active={selectedCount === questionCount}
            onClick={() => setSelectedCount(questionCount)}
          >
            All ({questionCount})
          </PresetButton>
        </div>

        {questionCount === 0 ? (
          <EmptyState title="No exam questions available" className="bg-[var(--color-bg)]" asCard={false}>
            The mock exam cannot start until the question bank has questions.
          </EmptyState>
        ) : null}

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Selected: {Math.min(selectedCount, questionCount)} / {questionCount}
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Untimed · instant feedback per question
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            disabled={questionCount === 0}
            onClick={onStart}
            className="w-full sm:w-auto"
          >
            Start Mock Exam
          </Button>
        </div>
      </Card>
    </Container>
  );
}

function TagBreakdown({ rows }) {
  if (rows.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--color-muted)]">
          Answer questions to see the result breakdown.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => {
        const percentage = formatPercentage(row.correct, row.total);
        const needsReview = percentage < WARNING_THRESHOLD;
        const content = (
          <div className="flex min-h-[68px] flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="break-words text-sm font-semibold text-[var(--color-text)]">
                  {row.label}
                </span>
                {row.category ? (
                  <Badge variant={categoryVariant(row.category)}>
                    {row.category}
                  </Badge>
                ) : null}
              </span>
              {needsReview ? (
                <span className="text-xs font-semibold text-[var(--color-warning)]">
                  Needs review
                </span>
              ) : (
                <span className="text-xs text-[var(--color-muted)]">
                  Solid enough for this attempt
                </span>
              )}
            </div>
            <div className="flex min-w-[120px] flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {row.correct}/{row.total}
                </span>
                <span className={`text-sm font-semibold ${needsReview ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}`}>
                  {percentage}%
                </span>
              </div>
              <ProgressBar
                value={percentage}
                className={needsReview ? '[&>div]:bg-[var(--color-warning)]' : '[&>div]:bg-[var(--color-success)]'}
              />
            </div>
          </div>
        );

        return row.href ? (
          <Link key={row.key} href={row.href} className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]">
            {content}
          </Link>
        ) : (
          <div key={row.key}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

function MissedQuestions({ missedQuestions }) {
  if (missedQuestions.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--color-muted)]">
          No missed questions in the answered set.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {missedQuestions.map((question, index) => (
        <details
          key={question.id}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <summary className="cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold leading-6 text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]">
            {index + 1}. {question.questionText}
          </summary>
          <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Correct answer
              </p>
              <div className="mt-2 rounded-lg border border-[var(--color-success)] bg-emerald-950/20 p-3 text-sm leading-6 text-emerald-100">
                {getCorrectAnswerText(question)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Explanation
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">
                {question.explanation}
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function ResultsScreen({ results, questionsById, patternBySlug, onRetryMissed, onNewExam }) {
  const percentage = formatPercentage(results.score, results.total);
  const missedQuestions = results.wrongQuestions || [];
  const tagRows = buildTagRows({ results, questionsById, patternBySlug });
  const answeredLabel = results.endedEarly
    ? `Answered ${results.answeredCount} of ${results.plannedTotal} planned questions.`
    : `Answered ${results.total} questions.`;
  const breakdownTitle = results.endedEarly && results.answeredCount < 3
    ? 'Answered areas'
    : 'Weakest areas';

  return (
    <Container className="flex flex-col gap-7 py-8 sm:py-12">
      <section className="flex flex-col gap-3">
        <Badge variant={missedQuestions.length === 0 ? 'default' : 'behavioral'} className="w-fit">
          {results.endedEarly ? 'Ended early' : 'Complete'}
        </Badge>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Mock Exam Results
        </h1>
        <div className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-accent)]">
            {percentage}%
          </span>
          <span className="text-base text-[var(--color-muted)]">
            {results.score} / {results.total} correct
          </span>
        </div>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          {answeredLabel}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {breakdownTitle}
        </h2>
        <TagBreakdown rows={tagRows} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Missed questions
        </h2>
        <MissedQuestions missedQuestions={missedQuestions} />
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          disabled={missedQuestions.length === 0}
          onClick={onRetryMissed}
        >
          Retry missed questions
        </Button>
        <Button type="button" size="lg" variant="secondary" onClick={onNewExam}>
          New Mock Exam
        </Button>
      </div>
    </Container>
  );
}

export default function ExamClient({ questions, patterns }) {
  const defaultCount = Math.min(30, questions.length);
  const [selectedCount, setSelectedCount] = useState(defaultCount);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState('setup');
  const [recordAttempt, setRecordAttempt] = useState(true);

  const questionsById = useMemo(() => {
    return new Map(questions.map((question) => [question.id, question]));
  }, [questions]);

  const patternBySlug = useMemo(() => {
    return new Map(patterns.map((pattern) => [pattern.slug, pattern]));
  }, [patterns]);

  function startExam() {
    const nextQuestions = selectExamQuestions(questions, selectedCount, patterns);
    if (nextQuestions.length === 0) {
      return;
    }

    setSelectedQuestions(nextQuestions);
    setResults(null);
    setRecordAttempt(true);
    setMode('running');
  }

  function handleComplete(nextResults) {
    setResults(nextResults);

    if (recordAttempt) {
      recordExamAttempt({
        score: nextResults.score,
        total: nextResults.total,
        date: new Date().toISOString(),
      });
    }

    setMode('results');
  }

  function retryMissed() {
    const missed = results?.wrongQuestions || [];
    if (missed.length === 0) {
      return;
    }

    setSelectedQuestions(shuffleItems(missed));
    setResults(null);
    setRecordAttempt(false);
    setMode('running');
  }

  if (mode === 'running') {
    return (
      <Container className="py-8 sm:py-12">
        <QuizSession questions={selectedQuestions} onComplete={handleComplete} />
      </Container>
    );
  }

  if (mode === 'results' && results) {
    return (
      <ResultsScreen
        results={results}
        questionsById={questionsById}
        patternBySlug={patternBySlug}
        onRetryMissed={retryMissed}
        onNewExam={() => {
          setMode('setup');
          setResults(null);
          setSelectedQuestions([]);
          setRecordAttempt(true);
        }}
      />
    );
  }

  return (
    <SetupScreen
      questionCount={questions.length}
      selectedCount={selectedCount}
      setSelectedCount={setSelectedCount}
      onStart={startExam}
    />
  );
}
