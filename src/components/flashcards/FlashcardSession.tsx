"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Card, EmptyState } from "@/components/ui";
import { CardsIcon, InboxIcon } from "@/components/icons";
import { useStore } from "@/lib/storage";
import { GRADES, isDue, type GradeKey } from "@/lib/srs";
import { Markdown } from "@/components/lesson/Markdown";
import type { Course, Deck, Flashcard } from "@/lib/schema";

type Mode = "due" | "due-new" | "cram";
type Phase = "start" | "review" | "summary";

const GRADE_BUTTONS: { key: GradeKey; label: string; className: string }[] = [
  { key: "again", label: "Again", className: "bg-danger/15 text-danger hover:bg-danger/25" },
  { key: "hard", label: "Hard", className: "bg-warning/15 text-warning hover:bg-warning/25" },
  { key: "good", label: "Good", className: "bg-info/15 text-info hover:bg-info/25" },
  { key: "easy", label: "Easy", className: "bg-success/15 text-success hover:bg-success/25" },
];

export function FlashcardSession({ course, deck }: { course: Course; deck: Deck }) {
  const { state, hydrated, gradeCard } = useStore();
  const today = useMemo(() => (hydrated ? new Date() : null), [hydrated]);

  const [topic, setTopic] = useState<string | "all">("all");
  const [phase, setPhase] = useState<Phase>("start");
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState<Record<GradeKey, number>>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  const topics = useMemo(
    () => Array.from(new Set(deck.cards.map((c) => c.topic))).sort(),
    [deck.cards],
  );

  if (deck.cards.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="text-4xl" />}
        title="No flashcards yet"
        description="This course's deck is added in Phase 3."
      />
    );
  }

  if (!hydrated || !today) {
    return <div className="h-48 animate-pulse rounded-2xl bg-surface" aria-busy />;
  }

  const filtered = topic === "all" ? deck.cards : deck.cards.filter((c) => c.topic === topic);
  const dueCards = filtered.filter((c) => state.srs[c.id] && isDue(state.srs[c.id], today));
  const newCards = filtered.filter((c) => !state.srs[c.id]);

  const begin = (mode: Mode) => {
    let cards: Flashcard[];
    if (mode === "cram") cards = filtered;
    else if (mode === "due") cards = dueCards;
    else cards = [...dueCards, ...newCards];
    if (cards.length === 0) return;
    setQueue(cards);
    setIndex(0);
    setFlipped(false);
    setCounts({ again: 0, hard: 0, good: 0, easy: 0 });
    setPhase("review");
  };

  const grade = (key: GradeKey) => {
    const card = queue[index];
    gradeCard(card.id, GRADES[key], course.examDate);
    setCounts((c) => ({ ...c, [key]: c[key] + 1 }));
    if (index + 1 >= queue.length) setPhase("summary");
    else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  // ---- Start ----------------------------------------------------------------
  if (phase === "start") {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Due" value={dueCards.length} tone="text-warning" />
          <Stat label="New" value={newCards.length} tone="text-info" />
          <Stat label="Total" value={filtered.length} />
        </div>

        {topics.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            <Chip active={topic === "all"} onClick={() => setTopic("all")}>
              All
            </Chip>
            {topics.map((t) => (
              <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
                {t}
              </Chip>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => begin("due")} disabled={dueCards.length === 0}>
            Review due ({dueCards.length})
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => begin("due-new")}
            disabled={dueCards.length + newCards.length === 0}
          >
            Due + new ({dueCards.length + newCards.length})
          </Button>
          <Button variant="ghost" size="lg" onClick={() => begin("cram")}>
            Cram all ({filtered.length})
          </Button>
        </div>
      </div>
    );
  }

  // ---- Summary --------------------------------------------------------------
  if (phase === "summary") {
    const total = counts.again + counts.hard + counts.good + counts.easy;
    const stillDue = deck.cards.filter((c) => state.srs[c.id] && isDue(state.srs[c.id], today)).length;
    return (
      <div className="space-y-5">
        <Card className="text-center">
          <span className="inline-flex items-center gap-2 text-success">
            <CardsIcon className="text-2xl" />
            <span className="text-lg font-semibold text-fg">Session complete</span>
          </span>
          <p className="mt-1 text-sm text-fg-muted">{total} cards reviewed</p>
        </Card>
        <Card>
          <ul className="grid grid-cols-4 gap-2 text-center">
            {GRADE_BUTTONS.map((b) => (
              <li key={b.key}>
                <div className="text-lg font-semibold text-fg">{counts[b.key]}</div>
                <div className="text-xs text-fg-muted">{b.label}</div>
              </li>
            ))}
          </ul>
        </Card>
        <p className="text-center text-sm text-fg-muted">
          {stillDue > 0 ? `${stillDue} still due today` : "Nothing left due today 🎉"}
        </p>
        <Button className="w-full" onClick={() => setPhase("start")}>
          Back to deck
        </Button>
      </div>
    );
  }

  // ---- Review ---------------------------------------------------------------
  const card = queue[index];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-fg-muted">
        <span>
          {index + 1} / {queue.length}
        </span>
        <span>{card.topic}</span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="block min-h-[14rem] w-full rounded-2xl border border-border bg-surface p-6 text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Markdown>{card.front}</Markdown>
        {flipped ? (
          <div className="mt-4 border-t border-border pt-4">
            <Markdown>{card.back}</Markdown>
          </div>
        ) : (
          <p className="mt-4 text-xs text-fg-faint">Tap to flip</p>
        )}
      </button>

      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {GRADE_BUTTONS.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => grade(b.key)}
              className={cn(
                "flex h-12 items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                b.className,
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      ) : (
        <Button className="w-full" size="lg" onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-2 py-3">
      <div className={cn("text-2xl font-semibold text-fg", tone)}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-fg-muted">{label}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-primary text-on-primary" : "bg-surface-2 text-fg-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
