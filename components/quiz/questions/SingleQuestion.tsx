'use client';

import type { QuizOption } from '@/types/quiz';
import { useLang } from '@/lib/context/LangContext';

export default function SingleQuestion({
  options,
  value,
  onChange,
  disabled,
}: {
  options: QuizOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const { lang } = useLang();
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <label key={option.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-light-border bg-light-surface px-4 py-3 dark:border-dark-border dark:bg-dark-surface">
          <input type="radio" className="h-4 w-4" checked={value === option.id} disabled={disabled} onChange={() => onChange(option.id)} />
          <span>{option.text[lang]}</span>
        </label>
      ))}
    </div>
  );
}
