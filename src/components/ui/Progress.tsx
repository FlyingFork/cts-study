import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

function clampPct(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export interface ProgressBarProps {
  /** Completion percentage 0–100. */
  value: number;
  /** CSS color for the fill (course accent or semantic). Default `--primary`. */
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  color = "var(--primary)",
  label,
  showValue = true,
  className,
}: ProgressBarProps) {
  const pct = clampPct(value);
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs text-fg-muted">
          <span>{label}</span>
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export interface ProgressRingProps {
  /** Completion/mastery percentage 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** CSS color for the progress arc (course accent or semantic). */
  color?: string;
  trackColor?: string;
  className?: string;
  /** Center content; defaults to the rounded percentage. */
  children?: ReactNode;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  color = "var(--primary)",
  trackColor = "var(--surface-2)",
  className,
  children,
}: ProgressRingProps) {
  const pct = clampPct(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="img"
        aria-label={`${Math.round(pct)}%`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-fg">
        {children ?? `${Math.round(pct)}%`}
      </span>
    </div>
  );
}
