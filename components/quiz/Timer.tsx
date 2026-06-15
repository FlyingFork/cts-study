'use client';

export function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function Timer({ remainingMs }: { remainingMs: number }) {
  const urgent = remainingMs <= 5 * 60 * 1000;
  return (
    <span className={`font-mono text-sm font-semibold ${urgent ? 'text-red-600 dark:text-red-400' : 'text-light-text dark:text-dark-text'}`}>
      {formatDuration(remainingMs)}
    </span>
  );
}
