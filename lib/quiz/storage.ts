import type { QuizSession, QuizSettings } from '@/types/quiz';

export const SESSIONS_KEY = 'cts_quiz_sessions';
export const SETTINGS_KEY = 'cts_quiz_settings';

export const defaultQuizSettings: QuizSettings = {
  examDurationMinutes: 60,
  examQuestionCount: 50,
  practiceQuestionCount: 20,
  topicFilters: ['design-patterns', 'solid', 'clean-code', 'junit4', 'testing-strategies'],
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readSessions() {
  return readJson<QuizSession[]>(SESSIONS_KEY, []);
}

export function writeSessions(sessions: QuizSession[]) {
  writeJson(SESSIONS_KEY, sessions);
}

export function upsertSession(session: QuizSession) {
  const sessions = readSessions();
  const next = [session, ...sessions.filter((item) => item.id !== session.id)];
  writeSessions(next);
  return next;
}

export function readSettings() {
  return { ...defaultQuizSettings, ...readJson<Partial<QuizSettings>>(SETTINGS_KEY, {}) };
}

export function writeSettings(settings: QuizSettings) {
  writeJson(SETTINGS_KEY, settings);
}
