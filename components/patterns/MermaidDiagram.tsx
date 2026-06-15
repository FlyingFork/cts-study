'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';

let idCounter = 0;

export default function MermaidDiagram({ diagram }: { diagram: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [error, setError] = useState(false);
  const idRef = useRef(`mermaid-${++idCounter}`);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        themeVariables:
          theme === 'dark'
            ? {
                primaryColor: '#1e293b',
                primaryTextColor: '#e2e8f0',
                primaryBorderColor: '#475569',
                lineColor: '#94a3b8',
                secondaryColor: '#0f172a',
                tertiaryColor: '#1e293b',
                background: '#0f172a',
                mainBkg: '#1e293b',
                nodeBorder: '#475569',
                clusterBkg: '#1e293b',
                titleColor: '#e2e8f0',
                edgeLabelBackground: '#1e293b',
                attributeBackgroundColorEven: '#1e293b',
                attributeBackgroundColorOdd: '#0f172a',
              }
            : {
                primaryColor: '#f1f5f9',
                primaryTextColor: '#1e293b',
                primaryBorderColor: '#94a3b8',
                lineColor: '#64748b',
                secondaryColor: '#f8fafc',
                tertiaryColor: '#f1f5f9',
                background: '#ffffff',
                mainBkg: '#f1f5f9',
                nodeBorder: '#94a3b8',
                clusterBkg: '#f8fafc',
                titleColor: '#1e293b',
                edgeLabelBackground: '#f1f5f9',
              },
      });

      try {
        const { svg } = await mermaid.render(idRef.current, diagram);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [diagram, theme]);

  if (error) {
    return (
      <div className="rounded-md bg-light-surface p-4 text-sm text-light-muted dark:bg-dark-surface dark:text-dark-muted">
        Diagram unavailable.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="flex min-h-[200px] items-center justify-center overflow-x-auto rounded-md bg-light-bg p-4 dark:bg-dark-bg [&_svg]:mx-auto [&_svg]:max-w-full"
    />
  );
}
