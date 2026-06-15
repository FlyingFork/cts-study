'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { patterns, type Pattern } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import { useSearch } from '@/lib/hooks/useSearch';
import CategoryBadge from './CategoryBadge';

export default function SearchBar({ onResults }: { onResults: (patterns: Pattern[]) => void }) {
  const router = useRouter();
  const { lang, t } = useLang();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useSearch(patterns, query, lang);

  useEffect(() => {
    onResults(results);
  }, [onResults, results]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div className="relative w-full max-w-lg">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        className="h-11 w-full rounded-md border border-light-border bg-white px-10 text-sm outline-none transition placeholder:text-light-muted focus:border-light-accent focus:ring-2 focus:ring-light-accent/20 dark:border-dark-border dark:bg-dark-bg dark:placeholder:text-dark-muted dark:focus:border-dark-accent dark:focus:ring-dark-accent/20"
        placeholder={t('home.search.placeholder')}
        aria-label={t('home.search.placeholder')}
      />
      {showDropdown && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-md border border-light-border bg-light-bg shadow-xl dark:border-dark-border dark:bg-dark-surface">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-light-muted dark:text-dark-muted">No results</div>
          ) : (
            results.map((pattern) => (
              <button
                key={pattern.slug}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => router.push(`/patterns/${pattern.slug}`)}
                className="flex w-full items-center justify-between gap-3 border-b border-light-border px-4 py-3 text-left text-sm last:border-0 hover:bg-light-surface dark:border-dark-border dark:hover:bg-dark-surface2"
              >
                <span>
                  <span className="block font-medium">{pattern.name[lang]}</span>
                  <span className="line-clamp-1 text-xs text-light-muted dark:text-dark-muted">{pattern.oneliner[lang]}</span>
                </span>
                <CategoryBadge category={pattern.category} lang={lang} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
