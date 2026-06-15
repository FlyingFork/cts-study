'use client';

import { Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useQuizSession } from '@/lib/hooks/useQuizSession';
import { useTimer } from '@/lib/hooks/useTimer';
import { useLang } from '@/lib/context/LangContext';
import FlagButton from './FlagButton';
import NavigationGrid from './NavigationGrid';
import QuestionCard from './QuestionCard';
import Timer from './Timer';

function RunnerInner({ mode }: { mode: 'exam' | 'practice' }) {
  const { lang } = useLang();
  const { session, currentQuestion, index, setIndex, answer, toggleFlag, submit } = useQuizSession(mode);
  const onExpire = useCallback(() => submit(), [submit]);
  const remainingMs = useTimer((session?.settings.examDurationMinutes ?? 60) * 60 * 1000, mode === 'exam' && Boolean(session?.startedAt) && !session?.finishedAt, onExpire);

  if (!session || !currentQuestion) {
    return <p className="rounded-md bg-light-surface p-5 dark:bg-dark-surface">{lang === 'ro' ? 'Se incarca quiz-ul...' : 'Loading quiz...'}</p>;
  }

  const currentAnswer = session.answers[currentQuestion.id];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-light-border bg-light-surface p-4 dark:border-dark-border dark:bg-dark-surface">
        <div>
          <p className="text-sm font-medium text-light-muted dark:text-dark-muted">{mode === 'exam' ? (lang === 'ro' ? 'Examen cronometrat' : 'Timed exam') : (lang === 'ro' ? 'Mod de practica' : 'Practice mode')}</p>
          <h1 className="text-2xl font-semibold">{lang === 'ro' ? 'Intrebare' : 'Question'} {index + 1} {lang === 'ro' ? 'din' : 'of'} {session.questionIds.length}</h1>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'exam' && <Timer remainingMs={remainingMs} />}
          <FlagButton active={session.flaggedIds.includes(currentQuestion.id)} onClick={toggleFlag} />
          <button type="button" onClick={submit} className="min-h-11 rounded-md bg-light-accent px-4 py-2 text-sm font-semibold text-white dark:bg-dark-accent dark:text-dark-bg">
            {lang === 'ro' ? 'Trimite' : 'Submit'}
          </button>
        </div>
      </div>

      <QuestionCard key={currentQuestion.id} question={currentQuestion} shuffle={session.shuffles[currentQuestion.id]} answer={currentAnswer} mode={mode} onAnswer={answer} />

      <div className="flex flex-wrap justify-between gap-3">
        <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)} className="min-h-11 rounded-md border border-light-border px-4 py-2 text-sm disabled:opacity-40 dark:border-dark-border">
          {lang === 'ro' ? 'Anterior' : 'Previous'}
        </button>
        <div className="flex gap-3">
          {mode === 'practice' && (
            <button type="button" onClick={() => setIndex(Math.min(session.questionIds.length - 1, index + 1))} className="min-h-11 rounded-md border border-light-border px-4 py-2 text-sm dark:border-dark-border">
              {lang === 'ro' ? 'Sari peste' : 'Skip'}
            </button>
          )}
          <button type="button" disabled={index === session.questionIds.length - 1} onClick={() => setIndex(index + 1)} className="min-h-11 rounded-md border border-light-border px-4 py-2 text-sm disabled:opacity-40 dark:border-dark-border">
            {lang === 'ro' ? 'Urmator' : 'Next'}
          </button>
        </div>
      </div>

      <NavigationGrid session={session} currentIndex={index} onSelect={setIndex} />

      <Link href="/quiz" className="inline-flex text-sm font-semibold text-light-accent dark:text-dark-accent">
        {lang === 'ro' ? 'Inapoi la dashboard quiz' : 'Back to quiz dashboard'}
      </Link>
    </div>
  );
}

export default function QuizRunner({ mode }: { mode: 'exam' | 'practice' }) {
  return (
    <Suspense fallback={<p className="rounded-md bg-light-surface p-5 dark:bg-dark-surface">Loading quiz...</p>}>
      <RunnerInner mode={mode} />
    </Suspense>
  );
}
