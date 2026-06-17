export default function ProgressBar({ value = 0, className = '' }) {
  const numericValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, numericValue));
  return (
    <div className={`w-full h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-[var(--color-accent)] rounded-full transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
