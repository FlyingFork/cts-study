'use client';

import Link from 'next/link';
import { topicLabels } from '@/data/questions';
import { useLang } from '@/lib/context/LangContext';
import { useQuizStats } from '@/lib/hooks/useQuizStats';

export default function StatsPage() {
  const { lang } = useLang();
  const stats = useQuizStats();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-light-accent dark:text-dark-accent">quiz/stats</p>
        <h1 className="mt-2 text-3xl font-semibold">Quiz Stats</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <p className="text-sm text-light-muted dark:text-dark-muted">Sessions</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totalSessions}</p>
        </div>
        <div className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <p className="text-sm text-light-muted dark:text-dark-muted">Average</p>
          <p className="mt-2 text-3xl font-semibold">{Math.round(stats.averageScore * 100)}%</p>
        </div>
        <div className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <p className="text-sm text-light-muted dark:text-dark-muted">Best</p>
          <p className="mt-2 text-3xl font-semibold">{Math.round(stats.bestScore * 100)}%</p>
        </div>
      </section>

      <section className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
        <h2 className="font-semibold">Per-topic accuracy</h2>
        <div className="mt-4 grid gap-3">
          {stats.topicStats.map((topic) => {
            const pct = topic.totalPoints ? Math.round((topic.pointsEarned / topic.totalPoints) * 100) : 0;
            return (
              <div key={topic.topic}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{topicLabels[topic.topic][lang]}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-light-bg dark:bg-dark-bg">
                  <div className="h-2 rounded-full bg-light-accent dark:bg-dark-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
        <h2 className="font-semibold">Weak areas</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.weakTopics.length ? stats.weakTopics.map((topic) => (
            <Link key={topic.topic} href={`/quiz/practice?topic=${topic.topic}`} className="rounded-md border border-light-border px-3 py-2 text-sm font-semibold dark:border-dark-border">
              Practice {topicLabels[topic.topic][lang]}
            </Link>
          )) : <p className="text-sm text-light-muted dark:text-dark-muted">No weak areas yet.</p>}
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-light-border bg-light-surface dark:border-dark-border dark:bg-dark-surface">
        <div className="border-b border-light-border p-4 dark:border-dark-border">
          <h2 className="font-semibold">Session history</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-light-bg text-light-muted dark:bg-dark-bg dark:text-dark-muted">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Open</th>
              </tr>
            </thead>
            <tbody>
              {stats.finished.map((session) => (
                <tr key={session.id} className="border-t border-light-border dark:border-dark-border">
                  <td className="px-4 py-3">{new Date(session.finishedAt ?? session.startedAt).toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{session.mode}</td>
                  <td className="px-4 py-3 font-mono">{(session.score ?? 0).toFixed(2)}/{session.totalPoints}</td>
                  <td className="px-4 py-3"><Link href={`/quiz/results/${session.id}`} className="text-light-accent dark:text-dark-accent">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
