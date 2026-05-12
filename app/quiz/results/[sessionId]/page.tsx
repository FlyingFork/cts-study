'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { questions, topicLabels } from '@/data/questions';
import { readSessions } from '@/lib/quiz/storage';
import { formatDuration } from '@/components/quiz/Timer';
import { useLang } from '@/lib/context/LangContext';
import type { QuizSession, Topic } from '@/types/quiz';

export default function ResultsPage({ params }: { params: { sessionId: string } }) {
  const { lang } = useLang();
  const [session, setSession] = useState<QuizSession>();

  useEffect(() => {
    setSession(readSessions().find((item) => item.id === params.sessionId));
  }, [params.sessionId]);

  const rows = useMemo(() => {
    if (!session) return [];
    return session.questionIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean);
  }, [session]);

  if (!session) return <p className="rounded-md bg-light-surface p-5 dark:bg-dark-surface">Session not found.</p>;

  const score = session.score ?? 0;
  const total = session.totalPoints ?? session.questionIds.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const duration = (session.finishedAt ?? Date.now()) - session.startedAt;
  const topics = Object.keys(topicLabels) as Topic[];

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
        <p className="text-sm font-medium text-light-accent dark:text-dark-accent">quiz/results</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{score.toFixed(2)} / {total.toFixed(2)}</h1>
            <p className={`mt-2 font-semibold ${percent >= 50 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {percent >= 50 ? 'Pass' : 'Fail'} ({percent}%)
            </p>
          </div>
          <div className="text-sm text-light-muted dark:text-dark-muted">
            <p>Duration: {formatDuration(duration)}</p>
            <p>{new Date(session.finishedAt ?? session.startedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/quiz/practice?retry=${session.id}`} className="rounded-md border border-light-border px-4 py-2 text-sm font-semibold dark:border-dark-border">Retry same questions</Link>
          <Link href="/quiz/exam" className="rounded-md bg-light-accent px-4 py-2 text-sm font-semibold text-white dark:bg-dark-accent dark:text-dark-bg">New exam</Link>
          <Link href="/quiz/stats" className="rounded-md border border-light-border px-4 py-2 text-sm font-semibold dark:border-dark-border">Go to stats</Link>
        </div>
      </section>

      <section className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
        <h2 className="font-semibold">Topic breakdown</h2>
        <div className="mt-4 grid gap-3">
          {topics.map((topic) => {
            const topicQuestions = rows.filter((question) => question?.topic === topic);
            const earned = topicQuestions.reduce((sum, question) => sum + (session.answers[question!.id]?.pointsEarned ?? 0), 0);
            const pct = topicQuestions.length ? Math.round((earned / topicQuestions.length) * 100) : 0;
            return (
              <div key={topic}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{topicLabels[topic][lang]}</span>
                  <span>{earned.toFixed(2)}/{topicQuestions.length}</span>
                </div>
                <div className="h-2 rounded-full bg-light-bg dark:bg-dark-bg">
                  <div className="h-2 rounded-full bg-light-accent dark:bg-dark-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Question review</h2>
        {rows.map((question, i) => {
          if (!question) return null;
          const answer = session.answers[question.id];
          return (
            <article key={question.id} className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
              <div className="flex flex-wrap justify-between gap-3">
                <h3 className="font-semibold">Question {i + 1}</h3>
                <span className="font-mono text-sm">Marcat {(answer?.pointsEarned ?? 0).toFixed(2)} din 1.00</span>
              </div>
              <p className="mt-3 leading-7">{question.text[lang]}</p>
              <p className="mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted">{question.explanation[lang]}</p>
              {question.relatedPatternSlug && <Link href={`/patterns/${question.relatedPatternSlug}`} target="_blank" className="mt-3 inline-flex text-sm font-semibold text-light-accent dark:text-dark-accent">Review theory</Link>}
            </article>
          );
        })}
      </section>
    </div>
  );
}
