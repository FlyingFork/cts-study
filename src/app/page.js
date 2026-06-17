import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Container from '@/components/ui/Container';
import HomeProgressWidget from './HomeProgressWidget';

export const metadata = {
  title: 'CTS Study Tool',
  description: 'Fast Design Patterns and Software Quality exam prep.',
};

const ENTRY_POINTS = [
  {
    href: '/patterns',
    title: 'Patterns',
    description: 'Read the pattern pages when you need the idea, intent, and exam signals in one place.',
    accentClass: 'text-[var(--color-creational)]',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M5 5.5h9a3 3 0 0 1 3 3v10h-9a3 3 0 0 0-3 3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M17 8.5h2a2 2 0 0 1 2 2v8h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/flashcards',
    title: 'Flashcards',
    description: 'Memorize the pattern names and core clues fast, then mark the ones you know.',
    accentClass: 'text-[var(--color-structural)]',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <rect x="5" y="4" width="13" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8h5M9 12h6M9 16h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/practice',
    title: 'Practice',
    description: 'Drill just the patterns, topics, or question types that still need work.',
    accentClass: 'text-[var(--color-behavioral)]',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M5 12h14M12 5v14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/exam',
    title: 'Exam Mode',
    description: 'Take a full mock exam to find weak spots and confirm you are improving.',
    accentClass: 'text-[var(--color-accent)]',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M8 4h8l3 3v13H5V4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12h6M9 16h4M16 4v4h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/how-to-use',
    title: 'How to Use',
    description: 'Follow a simple cramming plan for the night before the exam.',
    accentClass: 'text-[var(--color-muted)]',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M6 7h12M6 12h12M6 17h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <Container className="flex flex-col gap-8 py-8 sm:gap-10 sm:py-12">
      <section className="flex flex-col gap-4">
        <Badge variant="default" className="w-fit">
          Tomorrow&apos;s exam prep
        </Badge>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl">
            Cram Design Patterns and Software Quality without wandering.
          </h1>
          <p className="text-base leading-7 text-[var(--color-muted)] sm:text-lg">
            Use this as a compact launchpad for the final pass: review patterns, memorize clues,
            drill weak areas, then check yourself with a mock exam.
          </p>
        </div>
      </section>

      <section aria-label="Study sections" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {ENTRY_POINTS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[180px] flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] transition-colors group-hover:border-[var(--color-accent)] ${item.accentClass}`}>
              {item.icon}
            </span>
            <span className="flex flex-1 flex-col gap-2">
              <span className="text-lg font-semibold text-[var(--color-text)]">
                {item.title}
              </span>
              <span className="text-sm leading-6 text-[var(--color-muted)]">
                {item.description}
              </span>
            </span>
          </Link>
        ))}
      </section>

      <HomeProgressWidget />
    </Container>
  );
}
