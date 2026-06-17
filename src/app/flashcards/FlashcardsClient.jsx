'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import { categoryVariant } from '@/lib/categories';
import {
  getFlashcardProgress,
  resetFlashcardProgress,
  setFlashcardStatus,
} from '@/lib/flashcardProgress';

const CATEGORIES = ['All', 'Creational', 'Structural', 'Behavioral'];
const MODES = [
  { id: 'browse', label: 'Browse' },
  { id: 'spaced', label: 'Spaced repetition' },
];
const STATUS_LABELS = {
  new: 'New',
  learning: 'Learning',
  known: 'Known',
};

const CATEGORY_STRIPE = {
  Creational: 'stripe-creational',
  Structural: 'stripe-structural',
  Behavioral: 'stripe-behavioral',
};

function getStatus(progress, slug) {
  const status = progress[slug]?.status;
  return status === 'learning' || status === 'known' ? status : 'new';
}

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function orderPatterns(patterns, order) {
  const patternBySlug = new Map(patterns.map((pattern) => [pattern.slug, pattern]));
  return order.map((slug) => patternBySlug.get(slug)).filter(Boolean);
}

function buildSessionQueue(patterns, progress) {
  const weightedSlugs = patterns.flatMap((pattern) => {
    const status = getStatus(progress, pattern.slug);
    const weight = status === 'known' ? 1 : 3;
    return Array.from({ length: weight }, () => pattern.slug);
  });

  return shuffleItems(weightedSlugs);
}

function Flashcard({ pattern, flipped, onFlip }) {
  const stripeClass = CATEGORY_STRIPE[pattern.category] || '';

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onFlip();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${flipped ? 'Hide' : 'Show'} answer for ${pattern.name}`}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      className="mx-auto w-full max-w-2xl cursor-pointer rounded-lg [perspective:1200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
    >
      <div
        className={`relative min-h-[360px] transition-transform duration-300 [transform-style:preserve-3d] sm:min-h-[430px] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front face */}
        <Card className={`absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center [backface-visibility:hidden] sm:p-8 ${stripeClass}`}>
          <Badge variant={categoryVariant(pattern.category)}>{pattern.category}</Badge>
          <h2 className="max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-[var(--color-text)] sm:text-5xl">
            {pattern.name}
          </h2>
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Tap to reveal
          </p>
        </Card>

        {/* Back face */}
        <Card className="absolute inset-0 flex flex-col justify-between gap-5 overflow-auto p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={categoryVariant(pattern.category)}>{pattern.category}</Badge>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                {pattern.name}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xl font-semibold leading-8 text-[var(--color-text)]">
                {pattern.oneLiner}
              </p>
              <p className="text-base leading-7 text-[var(--color-muted)]">
                {pattern.analogy}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {pattern.examSignals.slice(0, 4).map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-[var(--color-accent)] bg-[var(--color-bg)] px-3 py-1 text-sm font-[family-name:var(--font-mono)] text-[var(--color-accent)]"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <Link
            href={`/patterns/${pattern.slug}`}
            onClick={(event) => event.stopPropagation()}
            className="w-fit rounded-md text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            View full page →
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default function FlashcardsClient({ patterns }) {
  const [mode, setMode] = useState('browse');
  const [category, setCategory] = useState('All');
  const [browseOrder, setBrowseOrder] = useState(() => patterns.map((pattern) => pattern.slug));
  const [browseIndex, setBrowseIndex] = useState(0);
  const [sessionQueue, setSessionQueue] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState({});
  const [resetStep, setResetStep] = useState(false);

  const filteredPatterns = useMemo(() => {
    if (category === 'All') {
      return patterns;
    }

    return patterns.filter((pattern) => pattern.category === category);
  }, [patterns, category]);

  const browseDeck = useMemo(() => {
    return orderPatterns(filteredPatterns, browseOrder);
  }, [filteredPatterns, browseOrder]);

  const knownCount = useMemo(() => {
    return patterns.filter((pattern) => getStatus(progress, pattern.slug) === 'known').length;
  }, [patterns, progress]);

  const allKnown = patterns.length > 0 && knownCount === patterns.length;
  const currentBrowseCard = browseDeck[browseIndex] || browseDeck[0];
  const currentSessionSlug = sessionQueue[sessionIndex];
  const currentSessionCard = filteredPatterns.find((pattern) => pattern.slug === currentSessionSlug)
    || filteredPatterns[0];
  const currentCard = mode === 'browse' ? currentBrowseCard : currentSessionCard;
  const position = mode === 'browse' ? browseIndex + 1 : sessionIndex + 1;
  const total = mode === 'browse' ? browseDeck.length : sessionQueue.length;
  const currentStatus = currentCard ? getStatus(progress, currentCard.slug) : 'new';

  useEffect(() => {
    setProgress(getFlashcardProgress());
  }, []);

  useEffect(() => {
    setBrowseOrder(filteredPatterns.map((pattern) => pattern.slug));
    setBrowseIndex(0);
    setFlipped(false);
  }, [filteredPatterns]);

  useEffect(() => {
    if (mode !== 'spaced') {
      return;
    }

    setSessionQueue(buildSessionQueue(filteredPatterns, progress));
    setSessionIndex(0);
    setFlipped(false);
  }, [category, filteredPatterns, mode]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setFlipped(false);
    setResetStep(false);
  }

  function changeCategory(nextCategory) {
    setCategory(nextCategory);
    setResetStep(false);
  }

  function shuffleDeck() {
    if (mode === 'browse') {
      setBrowseOrder(shuffleItems(filteredPatterns.map((pattern) => pattern.slug)));
      setBrowseIndex(0);
    } else {
      setSessionQueue(buildSessionQueue(filteredPatterns, progress));
      setSessionIndex(0);
    }

    setFlipped(false);
    setResetStep(false);
  }

  function moveBrowseCard(direction) {
    setBrowseIndex((index) => {
      if (browseDeck.length === 0) {
        return 0;
      }

      return (index + direction + browseDeck.length) % browseDeck.length;
    });
    setFlipped(false);
    setResetStep(false);
  }

  function rateCard(status) {
    if (!currentSessionCard) {
      return;
    }

    const nextProgress = setFlashcardStatus(currentSessionCard.slug, status);
    const nextQueue = [...sessionQueue];

    if (status === 'learning') {
      const insertAt = Math.min(sessionIndex + 4, nextQueue.length);
      nextQueue.splice(insertAt, 0, currentSessionCard.slug);
    }

    const nextIndex = sessionIndex + 1;
    if (nextIndex >= nextQueue.length) {
      setSessionQueue(buildSessionQueue(filteredPatterns, nextProgress));
      setSessionIndex(0);
    } else {
      setSessionQueue(nextQueue);
      setSessionIndex(nextIndex);
    }

    setProgress(nextProgress);
    setFlipped(false);
    setResetStep(false);
  }

  function resetProgress() {
    if (!resetStep) {
      setResetStep(true);
      return;
    }

    resetFlashcardProgress();
    setProgress({});
    setSessionQueue(buildSessionQueue(filteredPatterns, {}));
    setSessionIndex(0);
    setFlipped(false);
    setResetStep(false);
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-col gap-7">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
                Flashcards
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                Review each pattern quickly, then switch to spaced repetition for the ones that need another pass.
              </p>
            </div>

            <div className="inline-flex w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 sm:w-auto">
              {MODES.map((item) => {
                const active = mode === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => changeMode(item.id)}
                    className={`min-h-[44px] flex-1 rounded-md px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] sm:flex-none ${
                      active
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => {
              const active = category === item;
              const variant = item === 'All' ? 'default' : categoryVariant(item);

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeCategory(item)}
                  className={`min-h-[44px] rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                    active ? 'scale-[1.05]' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Badge
                    variant={variant}
                    className={active ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]' : ''}
                  >
                    {item}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        {mode === 'spaced' ? (
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {knownCount} known / {patterns.length}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {knownCount === 0 ? 'No cards are marked known yet.' : 'Progress is saved on this device.'}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={resetStep ? 'danger' : 'secondary'}
                className="w-full sm:w-auto"
                onClick={resetProgress}
              >
                {resetStep ? 'Confirm reset' : 'Reset progress'}
              </Button>
            </div>
            <ProgressBar value={patterns.length > 0 ? (knownCount / patterns.length) * 100 : 0} />
          </Card>
        ) : null}

        {mode === 'spaced' && allKnown ? (
          <Card className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 p-8 text-center">
            <Badge variant="default">Complete</Badge>
            <div className="flex flex-col gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
                Every pattern is marked known.
              </h2>
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                You can reset progress for a fresh run or switch back to Browse mode for a quick pass.
              </p>
            </div>
            <Button
              type="button"
              variant={resetStep ? 'danger' : 'secondary'}
              onClick={resetProgress}
            >
              {resetStep ? 'Confirm reset' : 'Reset progress'}
            </Button>
          </Card>
        ) : currentCard ? (
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
                <span className="font-semibold text-[var(--color-text)]">
                  {position} / {Math.max(total, 1)}
                </span>
                {mode === 'spaced' ? (
                  <Badge variant="default">{STATUS_LABELS[currentStatus]}</Badge>
                ) : null}
              </div>
              <Button type="button" variant="secondary" onClick={shuffleDeck}>
                Shuffle
              </Button>
            </div>

            <Flashcard
              pattern={currentCard}
              flipped={flipped}
              onFlip={() => setFlipped((current) => !current)}
            />

            {mode === 'browse' ? (
              <div className="grid grid-cols-2 gap-3 sm:mx-auto sm:w-full sm:max-w-2xl">
                <Button type="button" variant="secondary" size="lg" onClick={() => moveBrowseCard(-1)}>
                  ← Prev
                </Button>
                <Button type="button" variant="primary" size="lg" onClick={() => moveBrowseCard(1)}>
                  Next →
                </Button>
              </div>
            ) : null}

            {mode === 'spaced' && flipped ? (
              <div className="grid grid-cols-1 gap-3 sm:mx-auto sm:w-full sm:max-w-2xl sm:grid-cols-2">
                <Button type="button" variant="secondary" size="lg" onClick={() => rateCard('learning')}>
                  Still learning
                </Button>
                <Button type="button" variant="primary" size="lg" onClick={() => rateCard('known')}>
                  Got it ✓
                </Button>
              </div>
            ) : null}
          </section>
        ) : (
          <EmptyState title="No cards match this filter">
            Choose another category to continue reviewing.
          </EmptyState>
        )}
      </div>
    </Container>
  );
}
