import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "note" | "tip" | "warning" | "key";

const toneMeta: Record<Tone, { color: string; label: string; glyph: string }> = {
  note: { color: "var(--info)", label: "Note", glyph: "i" },
  tip: { color: "var(--success)", label: "Tip", glyph: "✓" },
  warning: { color: "var(--warning)", label: "Warning", glyph: "!" },
  key: { color: "var(--primary)", label: "Key", glyph: "★" },
};

export interface CalloutProps {
  tone?: Tone;
  /** Heading; defaults to the tone label. Pair color with text/icon (a11y §7). */
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Callout({ tone = "note", title, children, className }: CalloutProps) {
  const meta = toneMeta[tone];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border-l-2 p-4 text-sm text-fg",
        className,
      )}
      style={{
        borderLeftColor: meta.color,
        backgroundColor: `color-mix(in srgb, ${meta.color} 8%, var(--surface))`,
      }}
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold"
        style={{
          color: meta.color,
          backgroundColor: `color-mix(in srgb, ${meta.color} 18%, transparent)`,
        }}
      >
        {meta.glyph}
      </span>
      <div className="min-w-0 space-y-1">
        <p className="font-semibold" style={{ color: meta.color }}>
          {title ?? meta.label}
        </p>
        <div className="text-fg-muted [&_p]:leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
