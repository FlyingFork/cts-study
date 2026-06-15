import { differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";

export interface CountdownPillProps {
  /** ISO date string or Date for the exam. */
  examDate: string | Date;
  /** Course accent color used when not urgent, e.g. "var(--course-cts)". */
  accent?: string;
  /** Reference "today"; pass for deterministic rendering/testing. */
  now?: Date;
  className?: string;
}

/** "Exam in N days" with urgency color: ≤2 danger, ≤4 warning, else course accent. */
export function CountdownPill({
  examDate,
  accent = "var(--primary)",
  now = new Date(),
  className,
}: CountdownPillProps) {
  const target = typeof examDate === "string" ? new Date(examDate) : examDate;
  const days = differenceInCalendarDays(target, now);

  const color =
    days <= 2 ? "var(--danger)" : days <= 4 ? "var(--warning)" : accent;

  const label =
    days < 0
      ? "Exam passed"
      : days === 0
        ? "Exam today"
        : days === 1
          ? "Exam tomorrow"
          : `Exam in ${days} days`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 16%, var(--surface))`,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
