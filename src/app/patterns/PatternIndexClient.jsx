'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import { categoryVariant } from '@/lib/categories';

const CATEGORIES = ['Creational', 'Structural', 'Behavioral'];

const CATEGORY_BORDER = {
  Creational: 'border-l-[var(--color-creational)]',
  Structural: 'border-l-[var(--color-structural)]',
  Behavioral: 'border-l-[var(--color-behavioral)]',
};

const CATEGORY_STRIPE = {
  Creational: 'stripe-creational',
  Structural: 'stripe-structural',
  Behavioral: 'stripe-behavioral',
};

export default function PatternIndexClient({ patterns }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const normalizedQuery = query.trim().toLowerCase();

  const groupedPatterns = useMemo(() => {
    return CATEGORIES.map((category) => {
      const items = patterns.filter((pattern) => {
        const matchesCategory = activeCategory === null || pattern.category === activeCategory;
        const matchesQuery =
          normalizedQuery.length === 0 || pattern.name.toLowerCase().includes(normalizedQuery);
        return pattern.category === category && matchesCategory && matchesQuery;
      });
      return { category, items };
    });
  }, [patterns, normalizedQuery, activeCategory]);

  const resultCount = groupedPatterns.reduce((total, group) => total + group.items.length, 0);

  function toggleCategory(category) {
    setActiveCategory((current) => (current === category ? null : category));
  }

  return (
    <Container className="py-10 sm:py-14 flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]">
            Pattern Library
          </h1>
          <p className="text-base text-[var(--color-muted)] max-w-2xl">
            Scan the core design patterns by category, then drill into the cues, code shape, and exam traps.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={activeCategory === null}
            onClick={() => setActiveCategory(null)}
            className={`min-h-[44px] rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
              activeCategory === null ? 'scale-[1.05]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Badge
              variant="default"
              className={activeCategory === null ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]' : ''}
            >
              All
            </Badge>
          </button>

          {CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(category)}
                className={`min-h-[44px] rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                  active ? 'scale-[1.05]' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Badge
                  variant={categoryVariant(category)}
                  className={active ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]' : ''}
                >
                  {category}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex flex-col gap-2">
          <label htmlFor="pattern-search" className="text-sm font-semibold text-[var(--color-text)]">
            Search by pattern name
          </label>
          <input
            id="pattern-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Adapter, Factory, Observer..."
            className="min-h-[46px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          />
          <p className="text-xs text-[var(--color-muted)]">
            {resultCount} of {patterns.length} patterns shown
          </p>
        </div>
      </section>

      {resultCount === 0 ? (
        <EmptyState title="No patterns match">
          Try a shorter name, clear the search, or show all categories.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-10">
          {groupedPatterns.map(({ category, items }) => {
            if (items.length === 0) return null;

            return (
              <section key={category} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <h2
                    className={`border-l-[3px] pl-3 text-xl font-semibold text-[var(--color-text)] ${CATEGORY_BORDER[category]}`}
                  >
                    {category}
                  </h2>
                  <Badge variant={categoryVariant(category)}>{items.length}</Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((pattern) => (
                    <Link
                      key={pattern.slug}
                      href={`/patterns/${pattern.slug}`}
                      className="group block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                    >
                      <Card
                        className={`h-full min-h-[140px] transition-all group-hover:shadow-md group-hover:brightness-110 ${CATEGORY_STRIPE[pattern.category]}`}
                      >
                        <div className="flex h-full flex-col gap-3">
                          <h3 className="text-lg font-semibold leading-snug text-[var(--color-text)]">
                            {pattern.name}
                          </h3>
                          <p className="text-sm leading-6 text-[var(--color-muted)]">{pattern.oneLiner}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </Container>
  );
}
