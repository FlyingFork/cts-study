import Card from './Card';

export default function EmptyState({
  title,
  children,
  badge,
  className = '',
  actions = null,
  asCard = true,
}) {
  const content = (
    <>
      {badge ? (
        <div className="w-fit rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)]">
          {badge}
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {title}
        </h2>
        <div className="text-sm leading-6 text-[var(--color-muted)]">
          {children}
        </div>
      </div>
      {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </>
  );

  if (!asCard) {
    return (
      <div className={`flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <Card className={`flex flex-col gap-4 p-5 ${className}`}>
      {content}
    </Card>
  );
}
