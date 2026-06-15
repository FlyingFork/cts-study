import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

/**
 * GFM markdown + KaTeX (inline `$…$` and display `$$…$$`). Shared component —
 * renders on the server (lesson body) or client (flashcards, try-it). Prose is
 * styled with the design tokens (02); measure capped at ~68ch for reading.
 */
const prose = cn(
  "max-w-[68ch] text-base leading-relaxed text-fg",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  "[&_p]:my-3",
  "[&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight",
  "[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-hover",
  "[&_strong]:font-semibold [&_strong]:text-fg",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-fg-muted",
  "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-surface-2 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em]",
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-surface-2 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_table]:my-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-sm",
  "[&_th]:border [&_th]:border-border [&_th]:bg-surface-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
  "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
  "[&_hr]:my-6 [&_hr]:border-border",
  "[&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1",
);

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn(prose, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
