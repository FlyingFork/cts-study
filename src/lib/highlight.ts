// Server-side syntax highlighting (build-docs/06 §2, 07 §1). Shiki runs on the
// server; client surfaces (quiz, walkthroughs) receive the rendered HTML string
// so we never ship the highlighter to the browser.

import { codeToHtml } from "shiki";

const THEME = "github-dark";

// Languages Shiki can't resolve fall back to plain text rather than throwing.
const FALLBACK_LANG = "text";

const ALIASES: Record<string, string> = {
  py: "python",
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  "": FALLBACK_LANG,
};

export async function highlightCode(code: string, lang = "text"): Promise<string> {
  const resolved = ALIASES[lang] ?? lang;
  try {
    return await codeToHtml(code, { lang: resolved, theme: THEME });
  } catch {
    return codeToHtml(code, { lang: FALLBACK_LANG, theme: THEME });
  }
}
