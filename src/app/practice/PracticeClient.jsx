'use client';

import { useEffect, useMemo, useState } from 'react';
import QuizSession, { getCorrectAnswerText } from '@/components/quiz/QuizSession';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import { categoryVariant } from '@/lib/categories';
import { getQuestionStats } from '@/lib/progress';

const QUESTION_TYPES = [
  { id: 'multiple_choice', label: 'Multiple choice' },
  { id: 'drag_and_drop', label: 'Code dropdowns' },
  { id: 'dropdown_matching', label: 'Matching' },
];

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function questionHasMisses(question) {
  const stats = getQuestionStats(question.id);
  return Math.max(0, stats.timesShown - stats.timesCorrect);
}

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function FilterSection({ title, summary, children }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-[52px] w-full items-center justify-between gap-4 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        <span className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[var(--color-text)]">{title}</span>
          <span className="text-xs text-[var(--color-muted)]">{summary}</span>
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm text-[var(--color-muted)]">
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? (
        <div className="border-t border-[var(--color-border)] p-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function Chip({ active, children, onClick, title }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      title={title}
      className={`min-h-[44px] max-w-[200px] truncate rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
          : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </button>
  );
}

function SetupScreen({
  patternGroups,
  topicTags,
  selectedPatterns,
  setSelectedPatterns,
  selectedTopics,
  setSelectedTopics,
  selectedTypes,
  setSelectedTypes,
  prioritizeMissed,
  setPrioritizeMissed,
  requestedCount,
  setRequestedCount,
  matchingQuestions,
  onClearFilters,
  onStart,
}) {
  const matchCount = matchingQuestions.length;
  const hasPatternFilter = selectedPatterns.length > 0;
  const hasTopicFilter = selectedTopics.length > 0;
  const hasTypeFilter = selectedTypes.length > 0;
  const sliderValue = matchCount === 0 ? 0 : Math.min(requestedCount, matchCount);

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <section className="flex flex-col gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Practice
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
          Build an untimed session from the question bank and get feedback after each answer.
        </p>
      </section>

      <div className="flex flex-col gap-4">
        <FilterSection
          title="Patterns"
          summary={hasPatternFilter ? `${selectedPatterns.length} selected` : 'All patterns'}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Chip active={!hasPatternFilter} onClick={() => setSelectedPatterns([])}>
                All
              </Chip>
            </div>
            {patternGroups.map((group) => (
              <div key={group.category} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={categoryVariant(group.category)}>{group.category}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((pattern) => (
                    <Chip
                      key={pattern.slug}
                      active={selectedPatterns.includes(pattern.slug)}
                      title={pattern.name}
                      onClick={() => setSelectedPatterns((current) => toggleValue(current, pattern.slug))}
                    >
                      {pattern.name}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Topics"
          summary={hasTopicFilter ? `${selectedTopics.length} selected` : 'All topics'}
        >
          <div className="flex flex-wrap gap-2">
            <Chip active={!hasTopicFilter} onClick={() => setSelectedTopics([])}>
              All
            </Chip>
            {topicTags.map((topic) => (
              <Chip
                key={topic}
                active={selectedTopics.includes(topic)}
                onClick={() => setSelectedTopics((current) => toggleValue(current, topic))}
              >
                {topic}
              </Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Question Types"
          summary={hasTypeFilter ? `${selectedTypes.length} selected` : 'All types'}
        >
          <div className="flex flex-wrap gap-2">
            <Chip active={!hasTypeFilter} onClick={() => setSelectedTypes([])}>
              All
            </Chip>
            {QUESTION_TYPES.map((type) => (
              <Chip
                key={type.id}
                active={selectedTypes.includes(type.id)}
                onClick={() => setSelectedTypes((current) => toggleValue(current, type.id))}
              >
                {type.label}
              </Chip>
            ))}
          </div>
        </FilterSection>
      </div>

      <Card className="flex flex-col gap-5 p-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={prioritizeMissed}
            onChange={(event) => setPrioritizeMissed(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-[var(--color-border)] accent-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          />
          <span className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              Prioritize questions I&apos;ve gotten wrong before
            </span>
            <span className="text-xs leading-5 text-[var(--color-muted)]">
              Saved on this device from previous practice and exam answers.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <label htmlFor="question-count" className="text-sm font-semibold text-[var(--color-text)]">
              {matchCount} questions match — choose how many
            </label>
            <input
              type="number"
              min={matchCount === 0 ? 0 : 1}
              max={matchCount}
              value={sliderValue}
              disabled={matchCount === 0}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                const clamped = Math.min(matchCount, Math.max(1, Number.isFinite(nextValue) ? nextValue : 1));
                setRequestedCount(clamped);
              }}
              className="min-h-[44px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:w-28"
            />
          </div>
          <input
            id="question-count"
            type="range"
            min={matchCount === 0 ? 0 : 1}
            max={Math.max(matchCount, 1)}
            value={sliderValue}
            disabled={matchCount === 0}
            onChange={(event) => setRequestedCount(Number(event.target.value))}
            className="min-h-[44px] w-full accent-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          />
        </div>

        {matchCount === 0 ? (
          <EmptyState
            title="No questions match these filters"
            badge="0 matches"
            className="bg-[var(--color-bg)]"
            asCard={false}
            actions={(
              <Button type="button" variant="secondary" onClick={onClearFilters}>
                Clear filters
              </Button>
            )}
          >
            Clear one filter or choose All to build a practice session.
          </EmptyState>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            disabled={matchCount === 0}
            onClick={onStart}
            className="w-full sm:w-auto"
          >
            Start Practice
          </Button>
        </div>
      </Card>
    </Container>
  );
}

function SummaryScreen({ results, onPracticeMissed, onNewFilters }) {
  const percentage = results.total > 0
    ? Math.round((results.score / results.total) * 100)
    : 0;
  const missedQuestions = results.wrongQuestions || [];

  return (
    <Container className="flex flex-col gap-7 py-8 sm:py-12">
      <section className="flex flex-col gap-3">
        <Badge variant={missedQuestions.length === 0 ? 'default' : 'behavioral'} className="w-fit">
          {results.endedEarly ? 'Ended early' : 'Complete'}
        </Badge>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Practice Summary
        </h1>
        <p className="text-base leading-7 text-[var(--color-muted)]">
          Score: <span className="font-semibold text-[var(--color-text)]">{results.score} / {results.total}</span>
          {' '}({percentage}%)
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Missed questions
        </h2>
        {missedQuestions.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--color-muted)]">
              No missed questions in the answered set.
            </p>
          </Card>
        ) : (
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
        )}
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          disabled={missedQuestions.length === 0}
          onClick={onPracticeMissed}
        >
          Practice these again
        </Button>
        <Button type="button" size="lg" variant="secondary" onClick={onNewFilters}>
          New filters
        </Button>
      </div>
    </Container>
  );
}

export default function PracticeClient({ questions, patternGroups, topicTags }) {
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [prioritizeMissed, setPrioritizeMissed] = useState(false);
  const [requestedCount, setRequestedCount] = useState(20);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState('setup');

  const matchingQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesPatterns = selectedPatterns.length === 0
        || selectedPatterns.some((pattern) => question.patterns.includes(pattern));
      const matchesTopics = selectedTopics.length === 0
        || selectedTopics.some((topic) => question.topics.includes(topic));
      const matchesTypes = selectedTypes.length === 0
        || selectedTypes.includes(question.type);

      return matchesPatterns && matchesTopics && matchesTypes;
    });
  }, [questions, selectedPatterns, selectedTopics, selectedTypes]);

  useEffect(() => {
    if (matchingQuestions.length === 0) {
      setRequestedCount(0);
      return;
    }

    setRequestedCount((current) => {
      if (current < 1) {
        return Math.min(20, matchingQuestions.length);
      }

      return Math.min(current, matchingQuestions.length);
    });
  }, [matchingQuestions.length]);

  function buildSelection(sourceQuestions = matchingQuestions) {
    const randomized = shuffleItems(sourceQuestions);
    const ordered = prioritizeMissed
      ? randomized.sort((left, right) => questionHasMisses(right) - questionHasMisses(left))
      : randomized;

    return ordered.slice(0, Math.min(requestedCount, ordered.length));
  }

  function startPractice() {
    const nextQuestions = buildSelection();
    if (nextQuestions.length === 0) {
      return;
    }

    setSelectedQuestions(nextQuestions);
    setResults(null);
    setMode('running');
  }

  function handleComplete(nextResults) {
    setResults(nextResults);
    setMode('summary');
  }

  function practiceMissed() {
    const missed = results?.wrongQuestions || [];
    if (missed.length === 0) {
      return;
    }

    setSelectedQuestions(shuffleItems(missed));
    setResults(null);
    setMode('running');
  }

  if (mode === 'running') {
    return (
      <Container className="py-8 sm:py-12">
        <QuizSession questions={selectedQuestions} onComplete={handleComplete} />
      </Container>
    );
  }

  if (mode === 'summary' && results) {
    return (
      <SummaryScreen
        results={results}
        onPracticeMissed={practiceMissed}
        onNewFilters={() => {
          setMode('setup');
          setResults(null);
          setSelectedQuestions([]);
        }}
      />
    );
  }

  return (
    <SetupScreen
      patternGroups={patternGroups}
      topicTags={topicTags}
      selectedPatterns={selectedPatterns}
      setSelectedPatterns={setSelectedPatterns}
      selectedTopics={selectedTopics}
      setSelectedTopics={setSelectedTopics}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      prioritizeMissed={prioritizeMissed}
      setPrioritizeMissed={setPrioritizeMissed}
      requestedCount={requestedCount}
      setRequestedCount={setRequestedCount}
      matchingQuestions={matchingQuestions}
      onClearFilters={() => {
        setSelectedPatterns([]);
        setSelectedTopics([]);
        setSelectedTypes([]);
      }}
      onStart={startPractice}
    />
  );
}
