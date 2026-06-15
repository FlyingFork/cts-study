import { highlightCode } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

/**
 * Server-highlighted code block (06 §2). Shiki runs here; the only client piece
 * is the copy button. Scrolls horizontally on mobile rather than the page.
 */
export async function CodeBlock({
  code,
  lang,
  caption,
}: {
  code: string;
  lang: string;
  caption?: string;
}) {
  const html = await highlightCode(code, lang);
  return (
    <figure className="my-4">
      <div className="relative">
        <div className="absolute right-2 top-2 z-10">
          <CopyButton code={code} />
        </div>
        <div
          className="overflow-x-auto rounded-xl text-sm [&_pre]:m-0 [&_pre]:rounded-xl [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {caption && (
        <figcaption className="mt-1.5 text-xs text-fg-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
