/** Route-level fallback (04 §5) — a calm skeleton matching the dark theme. */
export default function Loading() {
  return (
    <div className="space-y-4 py-6" aria-busy aria-label="Loading">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-surface-2" />
      <div className="h-24 animate-pulse rounded-2xl bg-surface" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </div>
    </div>
  );
}
