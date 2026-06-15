import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "border border-border bg-surface-2 text-fg-muted",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** Course accent color, e.g. "var(--course-cts)". Overrides `tone` colors. */
  accent?: string;
}

export function Badge({
  className,
  tone = "neutral",
  accent,
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        !accent && toneClasses[tone],
        className,
      )}
      style={
        accent
          ? {
              color: accent,
              backgroundColor: `color-mix(in srgb, ${accent} 14%, var(--surface))`,
              ...style,
            }
          : style
      }
      {...props}
    />
  );
}

/** Alias — a Pill is the same chip; name conveys intent at call sites. */
export const Pill = Badge;
