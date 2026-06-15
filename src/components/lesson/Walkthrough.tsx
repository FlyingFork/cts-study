"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import type { RenderableWalkthrough } from "./walkthrough-data";

/**
 * Code walkthrough (06 §3): two columns — code | explanation — that stack on
 * mobile. "Predict" mode hides explanations; tap a line to reveal it (the DSAD
 * predict-then-reveal pedagogy).
 */
export function Walkthrough({ data }: { data: RenderableWalkthrough }) {
  const [predict, setPredict] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const reveal = (key: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

  return (
    <section className="my-4 overflow-hidden rounded-2xl border border-border bg-surface">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-fg">{data.title}</h3>
            {data.corrected && <Badge tone="warning">corrected</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-fg-muted">{data.summary}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPredict((v) => !v);
            setRevealed(new Set());
          }}
          aria-pressed={predict}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            predict
              ? "border-primary bg-primary/15 text-primary"
              : "border-border bg-surface-2 text-fg-muted hover:text-fg",
          )}
        >
          {predict ? "Predict: on" : "Predict mode"}
        </button>
      </header>

      <div className="divide-y divide-border">
        {data.blocks.map((block, bi) => (
          <div key={bi} className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {block.label}
            </p>
            {block.note && <p className="mt-1 text-xs text-fg-muted">{block.note}</p>}

            <ol className="mt-2 space-y-2">
              {block.lines.map((line, li) => {
                const key = `${bi}-${li}`;
                const isRevealed = !predict || revealed.has(key);
                return (
                  <li key={key} className="grid gap-1 md:grid-cols-2 md:gap-4">
                    <div
                      className="overflow-x-auto rounded-lg text-xs [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-2.5 [&_pre]:font-mono"
                      dangerouslySetInnerHTML={{ __html: line.codeHtml }}
                    />
                    {isRevealed ? (
                      <p className="self-center text-sm text-fg-muted">{line.explain}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => reveal(key)}
                        className="self-center rounded-lg border border-dashed border-border px-3 py-1.5 text-left text-xs text-fg-faint transition-colors hover:border-primary hover:text-fg"
                      >
                        Tap to reveal explanation
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
