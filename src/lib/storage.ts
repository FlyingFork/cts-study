"use client";

// Phase 2 (build-docs/09-progress-persistence.md): the local, single-user state
// layer. One namespaced localStorage key holds a single JSON AppState, parsed
// safely with zod (corrupt/missing → a fresh default, never a crash).
//
// localStorage is touched ONLY on the client, inside effects/handlers — never
// during render/SSR. Server modules must `import type` from this file only.

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addDays, format } from "date-fns";
import { z } from "zod";
import type { Id } from "@/lib/schema";
import { CardStateSchema, newCardState, review, type CardState } from "@/lib/srs";

// ---- Persisted shapes --------------------------------------------------------

const ByTopicSchema = z.record(
  z.string(),
  z.object({ correct: z.number(), total: z.number() }),
);
export type ByTopic = z.infer<typeof ByTopicSchema>;

export const QuizResultSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  at: z.string(),
  topicFilter: z.array(z.string()).optional(),
  total: z.number(),
  correct: z.number(),
  byTopic: ByTopicSchema,
});
export type QuizResult = z.infer<typeof QuizResultSchema>;

export const ExamAttemptSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  at: z.string(),
  score: z.number(),
  outOf: z.number(),
  passed: z.boolean(),
  timeUsedMin: z.number(),
  byTopic: ByTopicSchema,
});
export type ExamAttempt = z.infer<typeof ExamAttemptSchema>;

export const TopicStatSchema = z.object({
  correct: z.number(),
  total: z.number(),
  lastSeen: z.string(),
});
export type TopicStat = z.infer<typeof TopicStatSchema>;

export const AppStateSchema = z.object({
  version: z.literal(1),
  startedAt: z.string(),
  lessonsCompleted: z.record(z.string(), z.string()), // lessonId → ISO completedAt
  srs: z.record(z.string(), CardStateSchema), // cardId → SM-2 state
  quizResults: z.array(QuizResultSchema),
  examAttempts: z.array(ExamAttemptSchema),
  topicStats: z.record(z.string(), TopicStatSchema),
  taskDone: z.record(z.string(), z.string()), // scheduler task id → ISO
  streak: z.object({ lastStudyDate: z.string(), count: z.number() }),
});
export type AppState = z.infer<typeof AppStateSchema>;

const STORAGE_KEY = "study-platform:v1";
const CURRENT_VERSION = 1 as const;

export function defaultState(now: Date = new Date()): AppState {
  return {
    version: CURRENT_VERSION,
    startedAt: now.toISOString(),
    lessonsCompleted: {},
    srs: {},
    quizResults: [],
    examAttempts: [],
    topicStats: {},
    taskDone: {},
    streak: { lastStudyDate: "", count: 0 },
  };
}

// ---- (De)serialisation -------------------------------------------------------

/** Migrate older persisted blobs to the current shape (trivial for v1). */
function migrate(raw: unknown): unknown {
  return raw; // no prior versions yet — placeholder for future schema bumps
}

/** Read + validate state from localStorage; any problem → a fresh default. */
export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = AppStateSchema.safeParse(migrate(JSON.parse(raw)));
    return parsed.success ? parsed.data : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota / privacy mode — fail silently; the app still works in-memory.
  }
}

// ---- Pure reducers (shared by the mutators) ---------------------------------

const isoDay = (date: Date): string => format(date, "yyyy-MM-dd");

/** Advance the study streak when an activity happens on a new calendar day. */
function bumpStreak(state: AppState, today: Date): AppState["streak"] {
  const todayStr = isoDay(today);
  if (state.streak.lastStudyDate === todayStr) return state.streak;
  const yesterday = isoDay(addDays(today, -1));
  const count = state.streak.lastStudyDate === yesterday ? state.streak.count + 1 : 1;
  return { lastStudyDate: todayStr, count };
}

/** Fold a quiz/exam's per-topic tally into the rolling topicStats. */
function mergeTopicStats(
  stats: AppState["topicStats"],
  byTopic: ByTopic,
  at: string,
): AppState["topicStats"] {
  const next = { ...stats };
  for (const [topic, { correct, total }] of Object.entries(byTopic)) {
    const prev = next[topic] ?? { correct: 0, total: 0, lastSeen: at };
    next[topic] = {
      correct: prev.correct + correct,
      total: prev.total + total,
      lastSeen: at,
    };
  }
  return next;
}

// ---- React store -------------------------------------------------------------

export interface StoreValue {
  state: AppState;
  /** True once the client effect has loaded persisted state (gate UI on this). */
  hydrated: boolean;
  completeLesson: (lessonId: Id) => void;
  gradeCard: (cardId: Id, grade: number, examDate?: string) => void;
  recordQuizResult: (result: QuizResult) => void;
  recordExamAttempt: (attempt: ExamAttempt) => void;
  setTaskDone: (taskId: Id, done: boolean) => void;
  resetProgress: () => void;
  exportState: () => string;
  importState: (json: string) => boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

interface Snapshot {
  state: AppState;
  hydrated: boolean;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // State + hydration flag travel together so hydration is a single setState.
  const [snap, setSnap] = useState<Snapshot>(() => ({
    state: defaultState(),
    hydrated: false,
  }));
  const { state, hydrated } = snap;

  // Hydrate from localStorage once, on the client only. This must run in an
  // effect (not a lazy initialiser) so SSR markup matches the first client
  // paint — the canonical pattern from 09; the lint rule is a false positive.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnap({ state: loadState(), hydrated: true });
  }, []);

  // Persist after hydration so the initial default never clobbers saved data.
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setSnap((prev) => ({ state: fn(prev.state), hydrated: prev.hydrated }));
  }, []);

  const completeLesson = useCallback(
    (lessonId: Id) => {
      const now = new Date();
      update((s) => ({
        ...s,
        lessonsCompleted: { ...s.lessonsCompleted, [lessonId]: now.toISOString() },
        streak: bumpStreak(s, now),
      }));
    },
    [update],
  );

  const gradeCard = useCallback(
    (cardId: Id, grade: number, examDate?: string) => {
      const now = new Date();
      update((s) => {
        const prev = s.srs[cardId] ?? newCardState(cardId, now);
        return {
          ...s,
          srs: { ...s.srs, [cardId]: review(prev, grade, now, examDate) },
          streak: bumpStreak(s, now),
        };
      });
    },
    [update],
  );

  const recordQuizResult = useCallback(
    (result: QuizResult) => {
      const now = new Date();
      update((s) => ({
        ...s,
        quizResults: [...s.quizResults, result],
        topicStats: mergeTopicStats(s.topicStats, result.byTopic, result.at),
        streak: bumpStreak(s, now),
      }));
    },
    [update],
  );

  const recordExamAttempt = useCallback(
    (attempt: ExamAttempt) => {
      const now = new Date();
      update((s) => ({
        ...s,
        examAttempts: [...s.examAttempts, attempt],
        topicStats: mergeTopicStats(s.topicStats, attempt.byTopic, attempt.at),
        streak: bumpStreak(s, now),
      }));
    },
    [update],
  );

  const setTaskDone = useCallback(
    (taskId: Id, done: boolean) => {
      const now = new Date();
      update((s) => {
        const taskDone = { ...s.taskDone };
        if (done) taskDone[taskId] = now.toISOString();
        else delete taskDone[taskId];
        return { ...s, taskDone, streak: done ? bumpStreak(s, now) : s.streak };
      });
    },
    [update],
  );

  const resetProgress = useCallback(() => update(() => defaultState()), [update]);

  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importState = useCallback(
    (json: string) => {
      try {
        const parsed = AppStateSchema.safeParse(migrate(JSON.parse(json)));
        if (!parsed.success) return false;
        update(() => parsed.data);
        return true;
      } catch {
        return false;
      }
    },
    [update],
  );

  const value = useMemo<StoreValue>(
    () => ({
      state,
      hydrated,
      completeLesson,
      gradeCard,
      recordQuizResult,
      recordExamAttempt,
      setTaskDone,
      resetProgress,
      exportState,
      importState,
    }),
    [
      state,
      hydrated,
      completeLesson,
      gradeCard,
      recordQuizResult,
      recordExamAttempt,
      setTaskDone,
      resetProgress,
      exportState,
      importState,
    ],
  );

  return createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a <StoreProvider>");
  return ctx;
}

/**
 * True only after client hydration (false during SSR + the first client paint).
 * Use to gate client-only values like `new Date()` without a markup mismatch.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export type { CardState };
