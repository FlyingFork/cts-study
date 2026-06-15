'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ProgressStatus } from '@/data/patterns';

type ProgressMap = Record<string, ProgressStatus>;

const statuses: ProgressStatus[] = ['not-started', 'studying', 'done'];

const ProgressContext = createContext<{
  progress: ProgressMap;
  setStatus: (slug: string, status: ProgressStatus) => void;
  cycleStatus: (slug: string) => void;
  getStatus: (slug: string) => ProgressStatus;
  studiedCount: number;
}>({
  progress: {},
  setStatus: () => {},
  cycleStatus: () => {},
  getStatus: () => 'not-started',
  studiedCount: 0,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const stored = localStorage.getItem('progress');
    if (!stored) return;
    try {
      setProgress(JSON.parse(stored) as ProgressMap);
    } catch {
      localStorage.removeItem('progress');
    }
  }, []);

  const value = useMemo(() => {
    const persist = (next: ProgressMap) => {
      setProgress(next);
      localStorage.setItem('progress', JSON.stringify(next));
    };

    const getStatus = (slug: string): ProgressStatus => progress[slug] ?? 'not-started';

    return {
      progress,
      getStatus,
      setStatus: (slug: string, status: ProgressStatus) => persist({ ...progress, [slug]: status }),
      cycleStatus: (slug: string) => {
        const current = getStatus(slug);
        const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
        persist({ ...progress, [slug]: next });
      },
      studiedCount: Object.values(progress).filter((status) => status === 'done').length,
    };
  }, [progress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export const useProgress = () => useContext(ProgressContext);
