'use client';

import type { LocalizedString } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';

export default function ExamKeywords({ keywords }: { keywords: LocalizedString[] }) {
  const { lang } = useLang();

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <span
          key={keyword.en}
          className="rounded-md bg-light-bg px-3 py-1 font-mono text-xs text-light-keyword dark:bg-dark-bg dark:text-dark-keyword"
        >
          {keyword[lang]}
        </span>
      ))}
    </div>
  );
}
