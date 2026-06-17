import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'How to Use | CTS Study Tool',
  description: 'A short cramming plan for Design Patterns and Software Quality exam prep.',
};

const SECTIONS = [
  {
    title: 'Patterns',
    href: '/patterns',
    description: 'Use this when you need to understand what a pattern is for, how it behaves, and what wording points to it on an exam.',
  },
  {
    title: 'Flashcards',
    href: '/flashcards',
    description: 'Use this for fast recognition: pattern names, one-line summaries, analogies, and exam clues.',
  },
  {
    title: 'Practice',
    href: '/practice',
    description: 'Use filters to drill only the patterns, topics, or question formats that are still costing you points.',
  },
  {
    title: 'Exam Mode',
    href: '/exam',
    description: 'Use this as a full mock exam when you need a quick read on your actual readiness.',
  },
];

const CRAM_STEPS = [
  'Take a quick Mock Exam first, before rereading everything, so you can see what is actually weak.',
  'Review the Pattern pages or Flashcards for the topics and patterns that came up shaky.',
  'Use Practice mode filtered to those weak areas until you are getting them consistently right.',
  'Take another Mock Exam to confirm the score moved and catch anything still fragile.',
];

export default function HowToUsePage() {
  return (
    <Container className="flex flex-col gap-8 py-8 sm:gap-10 sm:py-12">
      <section className="flex max-w-3xl flex-col gap-3">
        <Badge variant="default" className="w-fit">
          Study route
        </Badge>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
          How to use this site tonight
        </h1>
        <p className="text-base leading-7 text-[var(--color-muted)]">
          Keep the loop short: test yourself, review only what is weak, drill it, then test again.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Site sections">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            <Card className="flex h-full flex-col gap-2 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)]">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {section.title}
              </h2>
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                {section.description}
              </p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          Cramming order
        </h2>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CRAM_STEPS.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Card className="flex flex-col gap-2 p-5">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Where your progress is saved
        </h2>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Progress is saved locally in this browser with localStorage. Coming back on the same
          device and browser keeps your stats, but they will not follow you to a different
          browser or device. Clearing browser data resets them.
        </p>
      </Card>
    </Container>
  );
}
