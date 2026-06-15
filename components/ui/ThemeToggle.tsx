'use client';

import { Moon, Sun } from 'lucide-react';
import { useLang } from '@/lib/context/LangContext';
import { useTheme } from '@/lib/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';
  const label = isDark
    ? lang === 'ro'
      ? 'Comuta la modul luminos'
      : 'Switch to light mode'
    : lang === 'ro'
      ? 'Comuta la modul intunecat'
      : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-light-surface text-light-text transition hover:bg-light-surface2 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface2"
      aria-label={label}
      title={label}
    >
      {isDark ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
