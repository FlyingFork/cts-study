import type { Question, UserAnswerValue } from '@/types/quiz';

const round2 = (value: number) => Math.round(value * 100) / 100;

function asArray(value: UserAnswerValue): string[] {
  return Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
}

function partialCredit(selected: string[], correct: string[], all: string[]) {
  const correctSet = new Set(correct);
  const selectedSet = new Set(selected);
  const totalWrong = Math.max(1, all.length - correct.length);
  const correctSelected = correct.filter((id) => selectedSet.has(id)).length;
  const wrongSelected = selected.filter((id) => !correctSet.has(id)).length;
  return round2(Math.max(0, correctSelected / correct.length - wrongSelected / totalWrong));
}

export function scoreAnswer(question: Question, value: UserAnswerValue) {
  if (question.type === 'single') {
    const pointsEarned = value === question.correctId ? 1 : 0;
    return { pointsEarned, isCorrect: pointsEarned === 1 };
  }

  if (question.type === 'multiple') {
    const pointsEarned = partialCredit(asArray(value), question.correctIds, question.options.map((option) => option.id));
    return { pointsEarned, isCorrect: pointsEarned === 1 };
  }

  if (question.type === 'code') {
    const pointsEarned = partialCredit(asArray(value), question.correctIds, question.options.map((option) => option.id));
    return { pointsEarned, isCorrect: pointsEarned === 1 };
  }

  if (question.type === 'matching') {
    const answer = typeof value === 'object' && !Array.isArray(value) ? value : {};
    const correct = question.pairs.filter((pair) => answer[pair.id] === pair.id).length;
    const pointsEarned = round2(correct / question.pairs.length);
    return { pointsEarned, isCorrect: pointsEarned === 1 };
  }

  const selected = asArray(value);
  const correctOrder = question.items.map((item) => item.id);
  const pointsEarned = selected.length === correctOrder.length && selected.every((id, i) => id === correctOrder[i]) ? 1 : 0;
  return { pointsEarned, isCorrect: pointsEarned === 1 };
}

export function formatPoints(value: number) {
  return value.toFixed(2);
}
