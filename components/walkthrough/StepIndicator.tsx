'use client';

export default function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-2 flex-1 rounded-full ${index + 1 <= current ? 'bg-light-accent dark:bg-dark-accent' : 'bg-light-surface2 dark:bg-dark-surface2'}`}
        />
      ))}
    </div>
  );
}
