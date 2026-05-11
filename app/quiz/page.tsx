'use client';

import { useMemo, useState } from 'react';
import { quizQuestions } from '@/data/quiz';
import { patternBySlug } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import { useProgress } from '@/lib/context/ProgressContext';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResults';

type Mode = 'all' | 'structural' | 'behavioral' | 'weak';

export default function QuizPage() {
  const { lang, t } = useLang();
  const { getStatus } = useProgress();
  const [mode, setMode] = useState<Mode>('all');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const questions = useMemo(() => {
    if (mode === 'all') return quizQuestions;
    if (mode === 'weak') return quizQuestions.filter((question) => getStatus(question.correctAnswer) !== 'done');
    return quizQuestions.filter((question) => patternBySlug[question.correctAnswer]?.category === mode);
  }, [getStatus, mode]);

  const current = questions[index] ?? questions[0];
  const score = questions.filter((question) => answers[question.id] === question.correctAnswer).length;

  const restart = () => {
    setIndex(0);
    setSelected(undefined);
    setAnswers({});
    setDone(false);
  };

  if (done) return <QuizResults score={score} total={questions.length} onRestart={restart} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-light-accent dark:text-dark-accent">quiz/run</p>
        <h1 className="mt-2 text-3xl font-semibold">{t('quiz.title')}</h1>
      </div>

      <div className="flex flex-wrap gap-2 rounded-md bg-light-surface p-1 dark:bg-dark-surface">
        {(['all', 'structural', 'behavioral', 'weak'] as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setMode(option);
              restart();
            }}
            className={`rounded-md border px-3 py-2 text-sm ${
              mode === option
                ? 'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent dark:text-dark-bg'
                : 'border-transparent text-light-muted dark:text-dark-muted'
            }`}
          >
            {t(`quiz.${option}`)}
          </button>
        ))}
      </div>

      {current ? (
        <section className="rounded-md bg-light-bg p-5 dark:bg-dark-bg">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-sm text-light-muted dark:text-dark-muted">
              {index + 1}/{questions.length}
            </span>
            <span className="font-mono text-sm text-light-muted dark:text-dark-muted">
              {score} pts
            </span>
          </div>
          <QuizQuestion
            question={current}
            selected={selected}
            locked={Boolean(selected)}
            onAnswer={(slug) => {
              setSelected(slug);
              setAnswers((value) => ({ ...value, [current.id]: slug }));
            }}
          />
          {selected && (
            <div className="mt-5 rounded-md bg-light-surface p-4 dark:bg-dark-surface">
              <p className={selected === current.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {selected === current.correctAnswer ? t('quiz.correct') : `${t('quiz.wrong')} ${patternBySlug[current.correctAnswer].name[lang]}`}
              </p>
              <p className="mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted">{current.explanation[lang]}</p>
              <button
                type="button"
                onClick={() => {
                  if (index === questions.length - 1) setDone(true);
                  else {
                    setIndex((value) => value + 1);
                    setSelected(undefined);
                  }
                }}
                className="mt-4 rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white dark:bg-dark-accent dark:text-dark-bg"
              >
                {index === questions.length - 1 ? t('quiz.results') : t('quiz.next')}
              </button>
            </div>
          )}
        </section>
      ) : (
        <p className="rounded-md border border-light-border p-5 text-light-muted dark:border-dark-border dark:text-dark-muted">No questions for this filter.</p>
      )}
    </div>
  );
}
