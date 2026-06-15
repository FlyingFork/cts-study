'use client';

import type { MatchingPair } from '@/types/quiz';
import { useLang } from '@/lib/context/LangContext';

export default function MatchingQuestion({
  pairs,
  rightOrder,
  value,
  onChange,
  disabled,
}: {
  pairs: MatchingPair[];
  rightOrder: string[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const { lang } = useLang();
  const rightById = Object.fromEntries(pairs.map((pair) => [pair.id, pair]));
  return (
    <div className="overflow-hidden rounded-md border border-light-border dark:border-dark-border">
      {pairs.map((pair) => (
        <div key={pair.id} className="grid gap-2 border-b border-light-border p-3 last:border-b-0 dark:border-dark-border sm:grid-cols-2">
          <span className="font-medium">{pair.left[lang]}</span>
          <select
            className="min-h-11 rounded-md border border-light-border bg-light-bg px-3 dark:border-dark-border dark:bg-dark-bg"
            value={value[pair.id] ?? ''}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, [pair.id]: event.target.value })}
          >
            <option value="">{lang === 'ro' ? 'Alege...' : 'Choose...'}</option>
            {rightOrder.map((id) => (
              <option key={id} value={id}>
                {rightById[id]?.right[lang]}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
