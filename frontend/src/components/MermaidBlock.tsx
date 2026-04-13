import { useEffect, useId, useRef, useState } from 'react';

let mermaidInitialized = false;

async function loadMermaid() {
  const { default: mermaid } = await import('mermaid');
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'neutral',
      suppressErrorRendering: true,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    });
    mermaidInitialized = true;
  }
  return mermaid;
}

interface MermaidBlockProps {
  chart: string;
}

/** Renders a Mermaid diagram from fenced ```mermaid source. */
export function MermaidBlock({ chart }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.innerHTML = '';

    let cancelled = false;
    const renderId = `mmd-${reactId}-${Math.random().toString(36).slice(2, 9)}`;
    const source = chart.trim();

    if (!source) {
      setPending(false);
      setError('Mermaid 内容为空');
      return;
    }

    setPending(true);
    setError(null);

    void (async () => {
      try {
        const mermaid = await loadMermaid();
        const mount = containerRef.current;
        if (cancelled || !mount) return;
        const { svg, bindFunctions } = await mermaid.render(renderId, source, mount);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
        setError(null);
      } catch (e) {
        if (containerRef.current) containerRef.current.innerHTML = '';
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Mermaid 渲染失败');
        }
      } finally {
        if (!cancelled) setPending(false);
      }
    })();

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div
        className="my-4 rounded-struct border-2 border-md-graphite bg-md-fog px-4 py-3 font-mono text-sm text-red-800"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className="relative my-4 overflow-x-auto rounded-struct border-2 border-md-graphite bg-md-cloud p-4 [&_svg]:h-auto [&_svg]:max-w-full"
      aria-busy={pending}
    >
      {pending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-struct bg-md-cloud/80 text-sm font-semibold text-md-slate">
          图表渲染中…
        </div>
      )}
      <div ref={containerRef} className="flex justify-center" role="img" aria-label="Mermaid 图表" />
    </div>
  );
}
