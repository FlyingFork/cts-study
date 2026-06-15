import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** CSS color for an accent top-border + subtle glow, e.g. "var(--course-cts)". */
  accent?: string;
}

export function Card({ className, accent, style, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5",
        accent && "border-t-2",
        className,
      )}
      style={
        accent
          ? {
              borderTopColor: accent,
              boxShadow: `0 -2px 32px -22px ${accent}`,
              ...style,
            }
          : style
      }
      {...props}
    >
      {children}
    </div>
  );
}
