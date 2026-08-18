import { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function KaTeXRenderer({ latex, displayMode = false, className = '' }: KaTeXRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return `<span style="color:#FF5C5C;font-size:12px">${latex}</span>`;
    }
  }, [latex, displayMode]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
