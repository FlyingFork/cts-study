export default function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
