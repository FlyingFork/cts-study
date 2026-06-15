// Server-side prep for code walkthroughs (06 §3). Pre-highlights every code
// line with Shiki so the interactive (client) renderer ships no highlighter.
// Walkthroughs are DSAD Python, so the language is fixed here.

import { highlightCode } from "@/lib/highlight";
import type { Walkthrough } from "@/lib/schema";

export interface RenderableLine {
  code: string;
  codeHtml: string;
  explain: string;
}

export interface RenderableBlock {
  label: string;
  note?: string;
  lines: RenderableLine[];
}

export interface RenderableWalkthrough {
  id: string;
  title: string;
  method: string;
  summary: string;
  corrected?: boolean;
  source?: string;
  blocks: RenderableBlock[];
}

export async function renderWalkthrough(w: Walkthrough): Promise<RenderableWalkthrough> {
  const blocks = await Promise.all(
    w.blocks.map(async (b) => ({
      label: b.label,
      note: b.note,
      lines: await Promise.all(
        b.lines.map(async (l) => ({
          code: l.code,
          explain: l.explain,
          codeHtml: await highlightCode(l.code, "python"),
        })),
      ),
    })),
  );
  return {
    id: w.id,
    title: w.title,
    method: w.method,
    summary: w.summary,
    corrected: w.corrected,
    source: w.source,
    blocks,
  };
}
