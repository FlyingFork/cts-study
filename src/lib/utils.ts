import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose conditional Tailwind classes, resolving conflicts predictably.
 * Used by every UI primitive (see build-docs/02-design-system.md §5).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a course's `accentToken` (e.g. "--course-cts") to a usable CSS color
 * `var(--course-cts)`. Course accents come only from the design tokens (02).
 */
export function accentVar(accentToken: string): string {
  return `var(${accentToken})`;
}
