'use client';

import { useLang } from '@/lib/context/LangContext';

export default function LangToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-grid h-9 grid-cols-2 items-center rounded-md bg-light-surface p-1 text-xs font-semibold leading-none dark:bg-dark-surface"
      aria-label="Toggle language"
    >
      {(['en', 'ro'] as const).map((option) => (
        <span
          key={option}
          className={`flex h-7 items-center justify-center rounded px-2 transition ${
            lang === option
              ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg'
              : 'text-light-muted dark:text-dark-muted'
          }`}
        >
          {option.toUpperCase()}
        </span>
      ))}
    </button>
  );
}
