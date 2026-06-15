import katex from "katex";
import { Callout } from "@/components/ui";
import type { ContentBlock, Walkthrough } from "@/lib/schema";
import { Markdown } from "./Markdown";
import { CodeBlock } from "./CodeBlock";
import { TryIt } from "./TryIt";
import { LessonImage } from "./LessonImage";
import { Walkthrough as WalkthroughView } from "./Walkthrough";
import { renderWalkthrough } from "./walkthrough-data";

const CALLOUT_TONE: Record<string, "note" | "tip" | "warning" | "key"> = {
  note: "note",
  tip: "tip",
  warning: "warning",
  key: "key",
};

function resolveSrc(src: string, courseId: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/courses/${courseId}/${src}`;
}

/** Resolve + render a referenced walkthrough (async, server-only). */
async function WalkthroughRef({
  id,
  walkthroughs,
}: {
  id: string;
  walkthroughs?: Walkthrough[];
}) {
  const w = walkthroughs?.find((x) => x.id === id);
  if (!w) return null;
  const data = await renderWalkthrough(w);
  return <WalkthroughView data={data} />;
}

/**
 * Renders an ordered lesson body (03 §4 / 06 §2). One renderer per block kind.
 * Shiki + KaTeX run on the server; only the interactive blocks are client.
 */
export function LessonBody({
  blocks,
  courseId,
  walkthroughs,
}: {
  blocks: ContentBlock[];
  courseId: string;
  walkthroughs?: Walkthrough[];
}) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "markdown":
            return <Markdown key={i}>{block.md}</Markdown>;

          case "math": {
            const html = katex.renderToString(block.tex, {
              throwOnError: false,
              displayMode: block.display ?? false,
            });
            return block.display ? (
              <div
                key={i}
                className="my-4 overflow-x-auto text-center text-fg"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
            );
          }

          case "image":
            return (
              <LessonImage
                key={i}
                src={resolveSrc(block.src, courseId)}
                alt={block.alt}
                caption={block.caption}
              />
            );

          case "code":
            return <CodeBlock key={i} code={block.code} lang={block.lang} caption={block.caption} />;

          case "callout":
            return (
              <Callout key={i} tone={CALLOUT_TONE[block.tone]} title={block.title} className="my-4">
                <Markdown>{block.md}</Markdown>
              </Callout>
            );

          case "tryIt":
            return <TryIt key={i} prompt={block.prompt} answerMd={block.answerMd} />;

          case "walkthroughRef":
            return <WalkthroughRef key={i} id={block.walkthroughId} walkthroughs={walkthroughs} />;

          case "divider":
            return <hr key={i} className="my-6 border-border" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
