'use client';

import { Bot, Check, ChevronDown, Copy, Download, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLang } from '@/lib/context/LangContext';

const promptText = `You are helping me study CTS design patterns using the exported Markdown knowledge base as the only source of truth.

When I give you a professor-style question:
1. Identify the most likely pattern from the course's 10 patterns.
2. Explain the decision using the exact exam clues and intent from the knowledge base.
3. Name the required roles/classes and map them to the problem.
4. If code is requested, write a Java solution in the same style as the course examples.
5. If two patterns are similar, compare them and explain why the rejected pattern is not the best answer.
6. Keep the answer exam-focused, concise, and aligned with the professor's expected reasoning.

Do not invent patterns outside this course unless I explicitly ask. If the question is ambiguous, ask for the missing detail before choosing a pattern.`;

export default function AiCourseExport() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const downloadUrl = useMemo(() => '/api/course-export', []);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="rounded-md bg-light-surface p-5 dark:bg-dark-surface">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-light-accent dark:text-dark-accent">
            <Bot className="h-5 w-5" />
            <span className="text-sm font-semibold">{t('patterns.ai.title')}</span>
          </div>
          <p className="text-sm leading-6 text-light-muted dark:text-dark-muted">{t('patterns.ai.body')}</p>
        </div>
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-light-muted transition dark:text-dark-muted ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-5 border-t border-light-border pt-5 dark:border-dark-border">
          <a
            href={downloadUrl}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-light-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-light-accent/90 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-dark-accent/90"
          >
            <Download className="h-4 w-4" />
            {t('patterns.ai.download')}
          </a>

          <div className="mt-5 rounded-md bg-light-bg p-4 dark:bg-dark-bg">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-light-accent dark:text-dark-accent" />
                {t('patterns.ai.promptLabel')}
              </div>
              <button
                type="button"
                onClick={copyPrompt}
                className="inline-flex items-center gap-2 rounded-md bg-light-surface px-3 py-2 text-sm font-semibold transition hover:text-light-accent dark:bg-dark-surface dark:hover:text-dark-accent"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t('patterns.ai.copied') : t('patterns.ai.copyPrompt')}
              </button>
            </div>
            <textarea
              readOnly
              value={promptText}
              className="min-h-48 w-full resize-y rounded-md border border-light-border bg-white p-3 font-mono text-xs leading-5 text-light-text outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
              aria-label={t('patterns.ai.promptLabel')}
            />
          </div>
        </div>
      )}
    </section>
  );
}
