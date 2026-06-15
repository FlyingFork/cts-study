import Link from 'next/link';

export default function TerminalPrompt() {
  return (
    <Link href="/" className="flex items-center gap-2 text-sm font-semibold" aria-label="CTS home">
      <span className="flex h-8 w-9 items-center justify-center rounded-md bg-light-accent text-xs font-bold text-white dark:bg-dark-accent dark:text-dark-bg">
        CTS
      </span>
      <span className="hidden sm:inline">CTS</span>
    </Link>
  );
}
