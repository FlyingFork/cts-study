'use client';

import { useEffect, useState } from 'react';

export function useTimer(durationMs: number, active: boolean, onExpire: () => void) {
  const [remainingMs, setRemainingMs] = useState(durationMs);

  useEffect(() => {
    if (!active) return undefined;
    const deadline = Date.now() + remainingMs;
    const id = window.setInterval(() => {
      const next = Math.max(0, deadline - Date.now());
      setRemainingMs(next);
      if (next === 0) {
        window.clearInterval(id);
        onExpire();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [active, onExpire, remainingMs]);

  return remainingMs;
}
