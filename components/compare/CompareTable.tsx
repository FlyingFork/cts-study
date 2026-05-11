'use client';

import { useMemo, useState } from 'react';
import { patterns, type Pattern } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CategoryBadge from '@/components/ui/CategoryBadge';

const presets = [
  ['adapter', 'proxy', 'decorator'],
  ['strategy', 'chain', 'command'],
  ['composite', 'decorator'],
];

const facts: Record<string, { same: string; wraps: string; changes: string; purpose: string }> = {
  adapter: { same: 'No', wraps: 'Yes', changes: 'Yes', purpose: 'Interface translation' },
  decorator: { same: 'Yes', wraps: 'Yes', changes: 'No', purpose: 'Add behavior' },
  composite: { same: 'Yes', wraps: 'No', changes: 'No', purpose: 'Tree uniformity' },
  flyweight: { same: 'N/A', wraps: 'No', changes: 'No', purpose: 'Memory sharing' },
  facade: { same: 'N/A', wraps: 'Uses many', changes: 'Creates simple API', purpose: 'Hide complexity' },
  proxy: { same: 'Yes', wraps: 'Yes', changes: 'No', purpose: 'Control access' },
  strategy: { same: 'Yes', wraps: 'No', changes: 'No', purpose: 'Swap algorithms' },
  chain: { same: 'Yes', wraps: 'Links next', changes: 'No', purpose: 'Route requests' },
  command: { same: 'Yes', wraps: 'Receiver action', changes: 'No', purpose: 'Queue/log/undo requests' },
  observer: { same: 'Yes', wraps: 'No', changes: 'No', purpose: 'Broadcast events' },
};

export default function CompareTable() {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<string[]>(presets[0]);
  const selectedPatterns = useMemo(
    () => selected.map((slug) => patterns.find((pattern) => pattern.slug === slug)).filter(Boolean) as Pattern[],
    [selected],
  );

  const toggle = (slug: string) => {
    setSelected((value) => {
      if (value.includes(slug)) return value.filter((item) => item !== slug);
      if (value.length >= 3) return [value[1], value[2], slug].filter(Boolean);
      return [...value, slug];
    });
  };

  const rows = [
    { label: t('compare.rows.category'), value: (pattern: Pattern) => <CategoryBadge category={pattern.category} lang={lang} /> },
    { label: t('compare.rows.sameInterface'), value: (pattern: Pattern) => facts[pattern.slug].same },
    { label: t('compare.rows.wraps'), value: (pattern: Pattern) => facts[pattern.slug].wraps },
    { label: t('compare.rows.changesInterface'), value: (pattern: Pattern) => facts[pattern.slug].changes },
    { label: t('compare.rows.purpose'), value: (pattern: Pattern) => facts[pattern.slug].purpose },
    { label: t('compare.rows.keyword'), value: (pattern: Pattern) => pattern.examKeywords[0][lang] },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <p className="text-sm font-medium text-light-accent dark:text-dark-accent">{t('compare.select')}</p>
        <h1 className="mt-2 text-3xl font-semibold">{t('compare.title')}</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, index) => (
          <button
            key={preset.join('-')}
            type="button"
            onClick={() => setSelected(preset)}
            className="rounded-md bg-light-surface px-3 py-2 text-sm hover:text-light-accent dark:bg-dark-surface dark:hover:text-dark-accent"
          >
            {t(`compare.preset${index + 1}`)}
          </button>
        ))}
      </div>

      <div className="rounded-md bg-light-surface p-4 dark:bg-dark-surface">
        <p className="mb-3 text-sm text-light-muted dark:text-dark-muted">{t('compare.select')}</p>
        <div className="flex flex-wrap gap-2">
          {patterns.map((pattern) => (
            <button
              key={pattern.slug}
              type="button"
              onClick={() => toggle(pattern.slug)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                selected.includes(pattern.slug)
                  ? 'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent dark:text-dark-bg'
                  : 'border-transparent bg-light-bg text-light-muted dark:bg-dark-bg dark:text-dark-muted'
              }`}
            >
              {pattern.name[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md bg-light-surface dark:bg-dark-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 font-mono text-xs text-light-muted dark:text-dark-muted">property</th>
              {selectedPatterns.map((pattern) => (
                <th key={pattern.slug} className="px-4 py-3 text-lg font-semibold">
                  {pattern.name[lang]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-light-border/70 dark:border-dark-border/70">
                <td className="px-4 py-3 font-medium">{row.label}</td>
                {selectedPatterns.map((pattern) => (
                  <td key={pattern.slug} className="px-4 py-3 text-light-muted dark:text-dark-muted">
                    {row.value(pattern)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
