'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocSection {
  id: string;
  label: string;
}

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const callback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-15% 0px -75% 0px',
    });

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    observers.push(observer);

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [ids]);

  return activeId;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 88;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

interface Props {
  sections: TocSection[];
}

export function PatternTocDesktop({ sections }: Props) {
  const ids = sections.map((s) => s.id);
  const activeId = useActiveSection(ids);

  return (
    <nav aria-label="Page sections" className="no-print hidden lg:block">
      <div className="sticky top-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted">
          On this page
        </p>
        <div className="relative border-l-2 border-light-border dark:border-dark-border">
          {sections.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={`relative flex w-full py-2 pl-4 pr-2 text-left text-sm leading-snug transition-colors ${
                  active
                    ? 'font-semibold text-light-accent dark:text-dark-accent'
                    : 'text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text'
                }`}
              >
                {active && (
                  <span className="absolute -left-[2px] top-0 h-full w-0.5 rounded-full bg-light-accent dark:bg-dark-accent" />
                )}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function PatternTocMobile({ sections }: Props) {
  const ids = sections.map((s) => s.id);
  const activeId = useActiveSection(ids);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = scrollRef.current?.querySelector(`[data-id="${activeId}"]`) as HTMLElement | null;
    activeEl?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="no-print lg:hidden fixed inset-x-0 top-16 z-40 border-b border-light-border/70 bg-light-bg/90 backdrop-blur dark:border-dark-border/70 dark:bg-dark-bg/90">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              data-id={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg'
                  : 'bg-light-surface text-light-muted hover:text-light-text dark:bg-dark-surface dark:text-dark-muted dark:hover:text-dark-text'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
