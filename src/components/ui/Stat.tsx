import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  /** Optional CSS color for the value (course accent or semantic). */
  color?: string;
  className?: string;
}

export function Stat({ label, value, hint, color, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-fg-muted">
        {label}
      </span>
      <span
        className="text-2xl font-semibold text-fg"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      {hint && <span className="text-xs text-fg-faint">{hint}</span>}
    </div>
  );
}
