export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-4 text-center text-sm text-[var(--color-muted)]">
      &copy; {new Date().getFullYear()} CTS &mdash; Built for exam prep
    </footer>
  );
}
