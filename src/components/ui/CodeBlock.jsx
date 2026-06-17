'use client';

import Prism from 'prismjs';
import 'prismjs/components/prism-java';

export default function CodeBlock({
  code,
  language = 'java',
  className = '',
  maxHeight = 'max-h-[640px]',
}) {
  const source = String(code || '');

  if (language !== 'java') {
    return (
      <div className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text)] ${className}`}>
        <p className="whitespace-pre-wrap break-words">{source}</p>
      </div>
    );
  }

  const highlighted = Prism.highlight(source, Prism.languages.java, 'java');

  return (
    <pre className={`${maxHeight} w-full overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm leading-6 text-[var(--color-text)] shadow-inner shadow-black/30 ${className}`}>
      <code
        className="block min-w-0 whitespace-pre font-[family-name:var(--font-mono)] language-java"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}
