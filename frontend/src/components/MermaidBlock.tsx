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
      class: {
        padding: 20,
        nodeSpacing: 55,
        rankSpacing: 55,
      },
    });
    mermaidInitialized = true;
  }
  return mermaid;
}

interface MermaidBlockProps {
  chart: string;
}

/** 渲染阶段在临时 DOM 里量的 foreignObject 常偏小，插入页面后按内容重算宽高，避免边标签被裁切。 */
function fixForeignObjectSizes(container: HTMLElement) {
  for (const fo of container.querySelectorAll<SVGForeignObjectElement>('foreignObject')) {
    const inner = fo.querySelector<HTMLElement>(':scope > div');
    if (!inner) continue;
    inner.style.overflow = 'visible';
    const rect = inner.getBoundingClientRect();
    let w = Math.max(inner.scrollWidth, inner.offsetWidth, rect.width);
    let h = Math.max(inner.scrollHeight, inner.offsetHeight, rect.height);
    w = Math.ceil(Math.max(w, 4));
    h = Math.ceil(Math.max(h, 18));
    fo.setAttribute('overflow', 'visible');
    fo.setAttribute('width', String(w + 8));
    fo.setAttribute('height', String(h + 8));
  }
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
        const mountEl = containerRef.current;
        mountEl.innerHTML = svg;
        const rootSvg = mountEl.querySelector('svg');
        if (rootSvg) {
          rootSvg.setAttribute('overflow', 'visible');
          rootSvg.style.overflow = 'visible';
        }
        requestAnimationFrame(() => {
          if (cancelled || !containerRef.current) return;
          fixForeignObjectSizes(containerRef.current);
          requestAnimationFrame(() => {
            if (cancelled || !containerRef.current) return;
            fixForeignObjectSizes(containerRef.current);
            bindFunctions?.(containerRef.current);
          });
        });
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
      className="relative my-4 w-full max-w-full overflow-visible rounded-struct border-2 border-md-graphite bg-md-cloud px-4 py-6 [&_svg]:h-auto [&_svg]:max-w-full [&_svg]:overflow-visible"
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
