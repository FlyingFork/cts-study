const STORAGE_KEY = 'cts.questionProgress.v1';
const EXAM_HISTORY_KEY = 'cts.examHistory.v1';

function canUseStorage() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readProgress() {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

function writeProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Treat blocked storage the same as no saved progress.
  }
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return {
      timesShown: 0,
      timesCorrect: 0,
      lastResult: null,
      updatedAt: null,
    };
  }

  return {
    timesShown: Number.isFinite(entry.timesShown) ? entry.timesShown : 0,
    timesCorrect: Number.isFinite(entry.timesCorrect) ? entry.timesCorrect : 0,
    lastResult: typeof entry.lastResult === 'boolean' ? entry.lastResult : null,
    updatedAt: Number.isFinite(entry.updatedAt) ? entry.updatedAt : null,
  };
}

export function recordAnswer(questionId, wasCorrect) {
  if (!questionId) {
    return {};
  }

  const progress = readProgress();
  const currentEntry = normalizeEntry(progress[questionId]);
  const nextEntry = {
    timesShown: currentEntry.timesShown + 1,
    timesCorrect: currentEntry.timesCorrect + (wasCorrect ? 1 : 0),
    lastResult: Boolean(wasCorrect),
    updatedAt: Date.now(),
  };
  const nextProgress = {
    ...progress,
    [questionId]: nextEntry,
  };

  writeProgress(nextProgress);
  return nextEntry;
}

export function getQuestionStats(questionId) {
  if (!questionId) {
    return {
      timesShown: 0,
      timesCorrect: 0,
      lastResult: null,
      updatedAt: null,
    };
  }

  return normalizeEntry(readProgress()[questionId]);
}

export function getQuestionProgressSummary() {
  const entries = Object.values(readProgress()).map(normalizeEntry);
  const totalAnswered = entries.reduce((sum, entry) => sum + entry.timesShown, 0);
  const totalCorrect = entries.reduce((sum, entry) => sum + entry.timesCorrect, 0);

  return {
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
  };
}

function normalizeExamAttempt(attempt) {
  if (!attempt || typeof attempt !== 'object' || Array.isArray(attempt)) {
    return null;
  }

  const score = Number(attempt.score);
  const total = Number(attempt.total);
  const date = typeof attempt.date === 'string' ? attempt.date : null;

  if (!Number.isFinite(score) || !Number.isFinite(total) || !date) {
    return null;
  }

  return {
    score,
    total,
    date,
  };
}

function readExamHistory() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(EXAM_HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeExamAttempt)
      .filter(Boolean)
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  } catch {
    return [];
  }
}

export function recordExamAttempt({ score, total, date = new Date().toISOString() } = {}) {
  const attempt = normalizeExamAttempt({ score, total, date });

  if (!attempt || !canUseStorage()) {
    return [];
  }

  const history = [attempt, ...readExamHistory()].slice(0, 20);
  try {
    window.localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(history));
  } catch {
    return [];
  }

  return history;
}

export function getExamHistory() {
  return readExamHistory();
}
