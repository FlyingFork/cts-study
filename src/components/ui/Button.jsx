const variants = {
  primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
  secondary: 'bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]',
  ghost: 'text-[var(--color-text)] hover:bg-[var(--color-surface)]',
  danger: 'bg-[var(--color-error)] text-white hover:opacity-90',
};

const sizes = {
  sm: 'text-sm px-3 min-h-[44px]',
  md: 'text-sm px-4 min-h-[44px]',
  lg: 'text-base px-6 min-h-[48px]',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
