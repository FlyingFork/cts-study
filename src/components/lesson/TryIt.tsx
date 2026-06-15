"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Markdown } from "./Markdown";

/** Self-check "try it" block (06 §2): a prompt with a reveal-able answer. */
export function TryIt({ prompt, answerMd }: { prompt: string; answerMd: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="my-4 rounded-xl border border-border border-l-2 border-l-primary bg-surface p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
        Try it
      </p>
      <Markdown>{prompt}</Markdown>
      {show ? (
        <div className="mt-3 border-t border-border pt-3">
          <Markdown>{answerMd}</Markdown>
        </div>
      ) : (
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => setShow(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}
