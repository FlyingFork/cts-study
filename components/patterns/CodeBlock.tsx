'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { github, vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useLang } from '@/lib/context/LangContext';
import { useTheme } from '@/lib/context/ThemeContext';

SyntaxHighlighter.registerLanguage('java', java);

export default function CodeBlock({
  code,
  language = 'java',
  highlightLines = [],
  fileName,
}: {
  code: string;
  language?: string;
  highlightLines?: number[];
  fileName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const { t } = useLang();
  const highlighted = new Set(highlightLines);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-md bg-light-bg dark:bg-dark-bg">
      <div className="flex items-center justify-between border-b border-light-border/70 px-4 py-2 dark:border-dark-border/70">
        <span className="font-mono text-xs text-light-muted dark:text-dark-muted">{fileName ?? 'Example.java'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-light-muted hover:bg-light-surface2 hover:text-light-text dark:text-dark-muted dark:hover:bg-dark-surface2 dark:hover:text-dark-text"
          aria-label={copied ? t('code.copied') : t('code.copy')}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t('code.copied') : t('code.copy')}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? vs2015 : github}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.65',
          padding: '1rem',
        }}
        lineProps={(lineNumber) => ({
          style: highlighted.has(lineNumber)
            ? {
                display: 'block',
                background: theme === 'dark' ? 'rgba(63,185,80,0.16)' : 'rgba(9,105,218,0.12)',
              }
            : { display: 'block' },
        })}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
