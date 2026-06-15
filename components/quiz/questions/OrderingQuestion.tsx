'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import type { OrderingItem } from '@/types/quiz';
import { useLang } from '@/lib/context/LangContext';

export default function OrderingQuestion({
  items,
  value,
  onChange,
  disabled,
}: {
  items: OrderingItem[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const { lang } = useLang();
  const byId = Object.fromEntries(items.map((item) => [item.id, item]));
  const order = Array.isArray(value) ? value : items.map((item) => item.id);
  const move = (index: number, delta: number) => {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      {order.map((id, index) => (
        <div key={id} className="flex items-center gap-3 rounded-md border border-light-border bg-light-surface p-3 dark:border-dark-border dark:bg-dark-surface">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-light-bg font-mono text-xs dark:bg-dark-bg">{index + 1}</span>
          <span className="min-w-0 flex-1">{byId[id]?.text[lang]}</span>
          <button type="button" disabled={disabled || index === 0} onClick={() => move(index, -1)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-light-border disabled:opacity-40 dark:border-dark-border" aria-label="Move up">
            <ArrowUp className="h-4 w-4" />
          </button>
          <button type="button" disabled={disabled || index === order.length - 1} onClick={() => move(index, 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-light-border disabled:opacity-40 dark:border-dark-border" aria-label="Move down">
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
