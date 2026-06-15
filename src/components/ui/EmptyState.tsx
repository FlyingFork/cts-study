import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Optional call-to-action, e.g. a <Button />. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="text-fg-faint" aria-hidden>
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-base font-medium text-fg">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
