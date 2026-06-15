'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { formatPoints, scoreAnswer } from '@/lib/quiz/scoring';
import { useLang } from '@/lib/context/LangContext';
import type { Question, QuestionShuffle, UserAnswer, UserAnswerValue } from '@/types/quiz';
import CodeQuestion from './questions/CodeQuestion';
import MatchingQuestion from './questions/MatchingQuestion';
import MultipleQuestion from './questions/MultipleQuestion';
import OrderingQuestion from './questions/OrderingQuestion';
import SingleQuestion from './questions/SingleQuestion';

function initialValue(question: Question, shuffle?: QuestionShuffle): UserAnswerValue {
  if (question.type === 'multiple' || question.type === 'code') return [];
  if (question.type === 'matching') return {};
  if (question.type === 'ordering') return shuffle?.itemIds ?? question.items.map((item) => item.id);
  return '';
}

export default function QuestionCard({
  question,
  shuffle,
  answer,
  mode,
  onAnswer,
}: {
  question: Question;
  shuffle?: QuestionShuffle;
  answer?: UserAnswer;
  mode: 'exam' | 'practice';
  onAnswer: (value: UserAnswerValue) => void;
}) {
  const { lang } = useLang();
  const [draft, setDraft] = useState<UserAnswerValue>(() => answer?.value ?? initialValue(question, shuffle));
  const locked = mode === 'practice' && Boolean(answer);
  const showFeedback = mode === 'practice' && Boolean(answer);

  useEffect(() => {
    setDraft(answer?.value ?? initialValue(question, shuffle));
  }, [answer, question, shuffle]);

  const options = useMemo(() => {
    if (question.type !== 'single' && question.type !== 'multiple' && question.type !== 'code') return [];
    const order = shuffle?.optionIds ?? question.options.map((option) => option.id);
    const byId = Object.fromEntries(question.options.map((option) => [option.id, option]));
    return order.map((id) => byId[id]).filter(Boolean);
  }, [question, shuffle]);

  const preview = scoreAnswer(question, draft);
  const canSubmit = question.type === 'single' ? Boolean(draft) : question.type === 'matching' ? Object.keys(draft as Record<string, string>).length === question.pairs.length : Array.isArray(draft) ? draft.length > 0 : true;

  return (
    <section className="rounded-md border border-light-border bg-light-bg p-5 dark:border-dark-border dark:bg-dark-bg">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${answer ? 'bg-green-600/15 text-green-700 dark:text-green-300' : 'bg-light-surface text-light-muted dark:bg-dark-surface dark:text-dark-muted'}`}>
          {answer ? (lang === 'ro' ? 'Complet' : 'Complete') : (lang === 'ro' ? 'Incomplet' : 'Incomplete')}
        </span>
        <span className="font-mono text-sm text-light-muted dark:text-dark-muted">
          {lang === 'ro' ? 'Marcat' : 'Marked'} {formatPoints(answer?.pointsEarned ?? (mode === 'practice' ? preview.pointsEarned : 0))} {lang === 'ro' ? 'din' : 'of'} 1.00
        </span>
      </div>

      <p className="mb-5 text-lg leading-8">{question.text[lang]}</p>

      {question.type === 'single' && <SingleQuestion options={options} value={draft as string} disabled={locked} onChange={(next) => setDraft(next)} />}
      {question.type === 'multiple' && <MultipleQuestion options={options} value={draft as string[]} disabled={locked} onChange={(next) => setDraft(next)} />}
      {question.type === 'matching' && <MatchingQuestion pairs={question.pairs} rightOrder={shuffle?.rightIds ?? question.pairs.map((pair) => pair.id)} value={draft as Record<string, string>} disabled={locked} onChange={(next) => setDraft(next)} />}
      {question.type === 'ordering' && <OrderingQuestion items={question.items} value={draft as string[]} disabled={locked} onChange={(next) => setDraft(next)} />}
      {question.type === 'code' && <CodeQuestion question={question} options={options} value={draft as string[]} disabled={locked} onChange={(next) => setDraft(next)} />}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canSubmit || locked}
          onClick={() => onAnswer(draft)}
          className="min-h-11 rounded-md bg-light-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-accent dark:text-dark-bg"
        >
          {answer ? (lang === 'ro' ? 'Raspuns salvat' : 'Answered') : (lang === 'ro' ? 'Salveaza raspunsul' : 'Save answer')}
        </button>
      </div>

      {showFeedback && (
        <div className="mt-5 rounded-md bg-light-surface p-4 dark:bg-dark-surface">
          <p className={answer?.isCorrect ? 'font-semibold text-green-700 dark:text-green-300' : 'font-semibold text-red-700 dark:text-red-300'}>
            {answer?.isCorrect ? (lang === 'ro' ? 'Corect' : 'Correct') : (lang === 'ro' ? 'Revizuieste raspunsul' : 'Review this answer')}
          </p>
          <p className="mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted">{question.explanation[lang]}</p>
          {question.relatedPatternSlug && (
            <Link href={`/patterns/${question.relatedPatternSlug}`} target="_blank" className="mt-3 inline-flex text-sm font-semibold text-light-accent dark:text-dark-accent">
              {lang === 'ro' ? 'Recapituleaza teoria' : 'Review theory'}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
