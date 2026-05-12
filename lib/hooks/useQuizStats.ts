'use client';

import { useEffect, useMemo, useState } from 'react';
import { questions } from '@/data/questions';
import type { QuizSession, Topic, TopicStats } from '@/types/quiz';
import { readSessions } from '@/lib/quiz/storage';

const topics: Topic[] = ['design-patterns', 'solid', 'clean-code', 'junit4', 'testing-strategies'];

export function useQuizStats() {
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    setSessions(readSessions());
  }, []);

  return useMemo(() => {
    const finished = sessions.filter((session) => session.finishedAt);
    const scores = finished.map((session) => (session.score ?? 0) / Math.max(1, session.totalPoints ?? session.questionIds.length));
    const stats: TopicStats[] = topics.map((topic) => ({ topic, attempted: 0, correct: 0, pointsEarned: 0, totalPoints: 0 }));

    for (const session of finished) {
      for (const answer of Object.values(session.answers)) {
        const question = questions.find((item) => item.id === answer.questionId);
        if (!question) continue;
        const row = stats.find((item) => item.topic === question.topic);
        if (!row) continue;
        row.attempted += 1;
        row.correct += answer.isCorrect ? 1 : 0;
        row.pointsEarned += answer.pointsEarned;
        row.totalPoints += 1;
      }
    }

    return {
      sessions,
      finished,
      totalSessions: finished.length,
      averageScore: scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0,
      bestScore: scores.length ? Math.max(...scores) : 0,
      topicStats: stats,
      weakTopics: stats.filter((item) => item.attempted > 0 && item.pointsEarned / Math.max(1, item.totalPoints) < 0.6),
    };
  }, [sessions]);
}
