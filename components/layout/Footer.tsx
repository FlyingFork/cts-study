'use client';

import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/context/LangContext';

const exploreLinks = [
  { href: '/patterns', key: 'nav.patterns' },
  { href: '/compare', key: 'nav.compare' },
  { href: '/cheatsheet', key: 'nav.cheatsheet' },
] as const;

const toolLinks = [
  { href: '/flashcards', key: 'nav.flashcards' },
  { href: '/quiz', key: 'nav.quiz' },
  { href: '/walkthrough/adapter', key: 'nav.walkthrough' },
] as const;

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="no-print border-t border-light-border dark:border-dark-border">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto]">
          <div className="space-y-4">
            <span className="font-mono text-sm font-semibold text-light-accent dark:text-dark-accent">
              CTS
            </span>
            <p className="max-w-xs text-sm leading-6 text-light-muted dark:text-dark-muted">
              {t('footer.tagline')}
            </p>
            <a
              href="https://github.com/FlyingFork/cts-study"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-light-border bg-light-surface px-3 py-1.5 text-xs font-medium text-light-muted transition hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted dark:hover:border-dark-accent dark:hover:text-dark-accent"
            >
              <Github className="h-3.5 w-3.5" />
              {t('footer.sourceCode')}
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted">
              {t('footer.explore')}
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-light-muted transition hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted">
              {t('footer.tools')}
            </h3>
            <ul className="space-y-2">
              {toolLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-light-muted transition hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-light-border pt-6 dark:border-dark-border sm:flex-row sm:items-center">
          <p className="text-xs text-light-muted dark:text-dark-muted">{t('footer.built')}</p>
          <a
            href="https://github.com/FlyingFork/cts-study"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-light-muted transition hover:text-light-accent dark:text-dark-muted dark:hover:text-dark-accent"
          >
            <Github className="h-3.5 w-3.5" />
            github.com/FlyingFork/cts-study
          </a>
        </div>
      </div>
    </footer>
  );
}
