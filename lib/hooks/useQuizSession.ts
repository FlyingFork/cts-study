'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { questions } from '@/data/questions';
import { scoreAnswer } from '@/lib/quiz/scoring';
import { buildQuizSession, questionById } from '@/lib/quiz/sessionBuilder';
import { readSessions, readSettings, upsertSession } from '@/lib/quiz/storage';
import type { QuizMode, QuizSession, Topic, UserAnswerValue } from '@/types/quiz';

export function useQuizSession(mode: QuizMode) {
  const router = useRouter();
  const params = useSearchParams();
  const retry = params.get('retry');
  const topic = params.get('topic') as Topic | null;
  const [session, setSession] = useState<QuizSession>();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const settings = readSettings();
    const retrySession = retry ? readSessions().find((item) => item.id === retry) : undefined;
    const next = buildQuizSession({
      mode,
      settings,
      questionIds: retrySession?.questionIds,
      topics: topic ? [topic] : undefined,
    });
    setSession(next);
    upsertSession(next);
  }, [mode, retry, topic]);

  const currentQuestion = useMemo(() => (session ? questionById(session.questionIds[index]) : undefined), [index, session]);

  const persist = useCallback((next: QuizSession) => {
    setSession(next);
    upsertSession(next);
  }, []);

  const visit = useCallback((nextIndex: number) => {
    if (!session) return;
    const questionId = session.questionIds[nextIndex];
    setIndex(nextIndex);
    if (questionId && !session.visitedIds.includes(questionId)) {
      persist({ ...session, visitedIds: [...session.visitedIds, questionId] });
    }
  }, [persist, session]);

  const answer = useCallback((value: UserAnswerValue) => {
    if (!session || !currentQuestion) return;
    const scored = scoreAnswer(currentQuestion, value);
    const next = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          value,
          isCorrect: scored.isCorrect,
          pointsEarned: scored.pointsEarned,
          timeSpentMs: Date.now() - session.startedAt,
        },
      },
    };
    persist(next);
  }, [currentQuestion, persist, session]);

  const toggleFlag = useCallback(() => {
    if (!session || !currentQuestion) return;
    const flagged = new Set(session.flaggedIds);
    if (flagged.has(currentQuestion.id)) flagged.delete(currentQuestion.id);
    else flagged.add(currentQuestion.id);
    persist({ ...session, flaggedIds: [...flagged] });
  }, [currentQuestion, persist, session]);

  const submit = useCallback(() => {
    if (!session) return;
    const score = Object.values(session.answers).reduce((sum, item) => sum + item.pointsEarned, 0);
    const next = { ...session, finishedAt: Date.now(), score, totalPoints: session.questionIds.length };
    persist(next);
    router.push(`/quiz/results/${next.id}`);
  }, [persist, router, session]);

  return {
    session,
    questions,
    currentQuestion,
    index,
    setIndex: visit,
    answer,
    toggleFlag,
    submit,
  };
}
