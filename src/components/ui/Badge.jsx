const variants = {
  creational: 'border border-[var(--color-creational)] bg-[#130e1a] text-[var(--color-creational)]',
  structural: 'border border-[var(--color-structural)] bg-[#091519] text-[var(--color-structural)]',
  behavioral: 'border border-[var(--color-behavioral)] bg-[#160d06] text-[var(--color-behavioral)]',
  default: 'bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-border)]',
};

export default function Badge({ variant = 'default', className = '', children }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
