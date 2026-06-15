"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/icons";

export function CopyButton({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — no-op.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/80 text-fg-muted backdrop-blur transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      {copied ? <CheckIcon className="text-base text-success" /> : <CopyIcon className="text-base" />}
    </button>
  );
}
