'use client';

import { useMemo } from 'react';
import type { Lang, Pattern } from '@/data/patterns';

export function useSearch(patterns: Pattern[], query: string, lang: Lang) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return patterns;

    return patterns.filter((pattern) => {
      const haystack = [
        pattern.name[lang],
        pattern.oneliner[lang],
        pattern.analogy[lang],
        pattern.category,
        ...pattern.examKeywords.map((keyword) => keyword[lang]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [lang, patterns, query]);
}
