'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '@/data/patterns';
import { translations } from '@/data/translations';

const LangContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}>({ lang: 'en', toggle: () => {}, t: (key) => key });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'ro' || stored === 'en') setLang(stored);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      toggle: () => {
        const next = lang === 'en' ? 'ro' : 'en';
        setLang(next);
        localStorage.setItem('lang', next);
      },
      t: (key: string, vars?: Record<string, string | number>) => {
        let text = translations[lang][key] ?? key;
        for (const [name, value] of Object.entries(vars ?? {})) {
          text = text.replace(`{${name}}`, String(value));
        }
        return text;
      },
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
