'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLang } from '@/lib/context/LangContext';
import { useProgress } from '@/lib/context/ProgressContext';
import LangToggle from '@/components/ui/LangToggle';
import TerminalPrompt from '@/components/ui/TerminalPrompt';
import ThemeToggle from '@/components/ui/ThemeToggle';

const nav = [
  { href: '/', key: 'nav.home', match: '/' },
  { href: '/patterns', key: 'nav.patterns', match: '/patterns' },
  { separator: true },
  { href: '/flashcards', key: 'nav.flashcards' },
  { href: '/quiz', key: 'nav.quiz' },
  { href: '/walkthrough/adapter', key: 'nav.walkthrough', match: '/walkthrough' },
  { separator: true },
  { href: '/compare', key: 'nav.compare' },
  { href: '/cheatsheet', key: 'nav.cheatsheet' },
] as const;

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <>
      {nav.map((item, i) => {
        if ('separator' in item) {
          return <div key={`sep-${i}`} className="hidden h-4 w-px bg-light-border dark:bg-dark-border md:block" />;
        }
        const match = 'match' in item ? item.match : item.href;
        const active = match === '/' ? pathname === '/' : pathname === match || pathname.startsWith(`${match}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`rounded-md px-2.5 py-2 text-sm transition ${
              active
                ? 'bg-light-bg text-light-text shadow-sm dark:bg-dark-bg dark:text-dark-text'
                : 'text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text'
            }`}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { studiedCount } = useProgress();
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-light-border/80 bg-light-bg/90 backdrop-blur dark:border-dark-border/80 dark:bg-dark-bg/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-light-border bg-light-surface md:hidden dark:border-dark-border dark:bg-dark-surface"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <TerminalPrompt />
        </div>

        <nav className="hidden items-center gap-1 rounded-md bg-light-surface p-1 md:flex dark:bg-dark-surface" aria-label="Primary navigation">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-md bg-light-surface px-2.5 py-2 text-xs text-light-muted sm:flex dark:bg-dark-surface dark:text-dark-muted">
            {t('home.studied', { n: studiedCount })}
          </div>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>

      {open && (
        <nav className="border-t border-light-border bg-light-bg px-4 py-3 md:hidden dark:border-dark-border dark:bg-dark-bg" aria-label="Mobile navigation">
          <div className="flex flex-col">
            <NavLinks onClick={() => setOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}
