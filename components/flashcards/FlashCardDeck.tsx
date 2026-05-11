'use client';

import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import { useProgress } from '@/lib/context/ProgressContext';
import FlashCard from './FlashCard';

export default function FlashCardDeck() {
  const { t } = useLang();
  const { getStatus } = useProgress();
  const [onlyNotDone, setOnlyNotDone] = useState(false);
  const [order, setOrder] = useState(patterns.map((pattern) => pattern.slug));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    const ordered = order.map((slug) => patterns.find((pattern) => pattern.slug === slug)).filter(Boolean) as typeof patterns;
    return onlyNotDone ? ordered.filter((pattern) => getStatus(pattern.slug) !== 'done') : ordered;
  }, [getStatus, onlyNotDone, order]);

  const current = deck[index] ?? deck[0] ?? patterns[0];

  const go = (direction: number) => {
    if (deck.length === 0) return;
    setIndex((value) => (value + direction + deck.length) % deck.length);
    setFlipped(false);
  };

  useEffect(() => {
    if (index >= deck.length) setIndex(0);
  }, [deck.length, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-light-accent dark:text-dark-accent">{t('flash.title')}</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('nav.flashcards')}</h1>
          <p className="mt-2 text-sm text-light-muted dark:text-dark-muted">{t('flash.front.hint')}</p>
        </div>
        <div className="text-sm text-light-muted dark:text-dark-muted">
          <span className="font-mono">{deck.length === 0 ? '0/0' : `${index + 1}/${deck.length}`}</span>
        </div>
      </div>

      <div className="rounded-md bg-light-surface p-3 dark:bg-dark-surface">
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-light-bg dark:bg-dark-bg">
          <div
            className="h-full rounded-full bg-light-accent transition-all dark:bg-dark-accent"
            style={{ width: deck.length === 0 ? '0%' : `${((index + 1) / deck.length) * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md bg-light-bg p-1 text-sm dark:bg-dark-bg">
            <button
              type="button"
              onClick={() => setOnlyNotDone(false)}
              className={`rounded px-3 py-1.5 ${!onlyNotDone ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg' : 'text-light-muted dark:text-dark-muted'}`}
            >
              {t('flash.all')}
            </button>
            <button
              type="button"
              onClick={() => setOnlyNotDone(true)}
              className={`rounded px-3 py-1.5 ${onlyNotDone ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg' : 'text-light-muted dark:text-dark-muted'}`}
            >
              {t('flash.notDone')}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setOrder((value) => [...value].sort(() => Math.random() - 0.5));
              setIndex(0);
              setFlipped(false);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-light-bg px-3 py-2 text-sm dark:bg-dark-bg"
          >
            <Shuffle className="h-4 w-4" /> {t('flash.shuffle')}
          </button>
        </div>
      </div>

      <FlashCard pattern={current} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(-1)} className="inline-flex items-center gap-2 rounded-md bg-light-surface px-4 py-2.5 text-sm font-semibold dark:bg-dark-surface">
          <ChevronLeft className="h-4 w-4" /> {t('flash.prev')}
        </button>
        <button type="button" onClick={() => setFlipped((value) => !value)} className="hidden rounded-md bg-light-accent px-4 py-2.5 text-sm font-semibold text-white dark:bg-dark-accent dark:text-dark-bg sm:inline-flex">
          {t('flash.flip')}
        </button>
        <button type="button" onClick={() => go(1)} className="inline-flex items-center gap-2 rounded-md bg-light-surface px-4 py-2.5 text-sm font-semibold dark:bg-dark-surface">
          {t('flash.next')} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
