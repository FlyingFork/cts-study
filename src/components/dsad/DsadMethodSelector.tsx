"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const METHODS = ["PCA", "EFA", "CCA", "HCA", "LDA"] as const;

const CLUES = [
  {
    text: "The subject splits standardized variables into production set X and consumption set Y.",
    answer: "CCA",
    why: "Two explicit variable blocks means canonical correlation analysis.",
  },
  {
    text: "There is a VULNERAB class column in the learning file and an apply file without it.",
    answer: "LDA",
    why: "Known labels plus an unlabeled apply set means supervised classification.",
  },
  {
    text: "The requirements mention dendrogram, Ward linkage, and a maximum-stability partition.",
    answer: "HCA",
    why: "Dendrogram and partition are hierarchical clustering cues.",
  },
  {
    text: "The subject asks for KMO, communalities, and specific factors.",
    answer: "EFA",
    why: "KMO and uniqueness/specific factors are EFA-only outputs.",
  },
  {
    text: "The outputs are principal components, variance line plot, scores, and a correlation circle.",
    answer: "PCA",
    why: "One variable set summarized into components is PCA unless EFA-only cues appear.",
  },
] as const;

export function DsadMethodSelector() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const clue = CLUES[index];
  const correct = picked === clue.answer;

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-fg">Method selector</h2>
        <Badge tone="info">recognition drill</Badge>
      </div>

      <p className="text-sm text-fg-muted">{clue.text}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {METHODS.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPicked(method)}
            className={cn(
              "h-10 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              picked === method
                ? method === clue.answer
                  ? "border-success bg-success/15 text-success"
                  : "border-danger bg-danger/15 text-danger"
                : "border-border bg-surface-2 text-fg-muted hover:bg-surface-3 hover:text-fg",
            )}
          >
            {method}
          </button>
        ))}
      </div>

      {picked && (
        <div className="flex gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm">
          {correct ? (
            <CheckCircleIcon className="mt-0.5 flex-none text-success" />
          ) : (
            <XCircleIcon className="mt-0.5 flex-none text-danger" />
          )}
          <p className="text-fg-muted">
            <span className={correct ? "font-medium text-success" : "font-medium text-danger"}>
              {correct ? "Correct." : `Not ${picked}.`}
            </span>{" "}
            {clue.why}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            setIndex((i) => (i + CLUES.length - 1) % CLUES.length);
            setPicked(null);
          }}
          className="text-sm font-medium text-fg-muted hover:text-fg"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            setIndex((i) => (i + 1) % CLUES.length);
            setPicked(null);
          }}
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Next clue
        </button>
      </div>
    </Card>
  );
}
