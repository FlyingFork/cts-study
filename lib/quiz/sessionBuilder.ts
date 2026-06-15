import { questions } from '@/data/questions';
import type { Question, QuestionShuffle, QuizMode, QuizSession, QuizSettings, Topic } from '@/types/quiz';
import { defaultQuizSettings } from './storage';

export function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function questionById(id: string) {
  return questions.find((question) => question.id === id);
}

function buildShuffle(question: Question): QuestionShuffle {
  if (question.type === 'single' || question.type === 'multiple' || question.type === 'code') {
    return { optionIds: shuffle(question.options.map((option) => option.id)) };
  }
  if (question.type === 'matching') {
    return { rightIds: shuffle(question.pairs.map((pair) => pair.id)) };
  }
  return { itemIds: shuffle(question.items.map((item) => item.id)) };
}

export function buildQuizSession({
  mode,
  settings = defaultQuizSettings,
  questionIds,
  topics,
}: {
  mode: QuizMode;
  settings?: QuizSettings;
  questionIds?: string[];
  topics?: Topic[];
}): QuizSession {
  const topicFilters = topics?.length ? topics : settings.topicFilters;
  const pool = questionIds
    ? questionIds.map(questionById).filter(Boolean) as Question[]
    : questions.filter((question) => topicFilters.includes(question.topic));
  const count = mode === 'exam' ? settings.examQuestionCount : settings.practiceQuestionCount;
  const selected = questionIds ? pool : shuffle(pool).slice(0, Math.min(count, pool.length));

  return {
    id: `${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode,
    startedAt: Date.now(),
    questionIds: selected.map((question) => question.id),
    answers: {},
    visitedIds: selected[0] ? [selected[0].id] : [],
    flaggedIds: [],
    shuffles: Object.fromEntries(selected.map((question) => [question.id, buildShuffle(question)])),
    settings,
  };
}
