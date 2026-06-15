import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-16">
      <EmptyState
        title="Page not found"
        description="That course or lesson doesn't exist (yet). Content is added course-by-course."
        action={
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
