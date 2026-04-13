import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MermaidBlock } from './MermaidBlock';

interface MarkdownContentProps {
  children: string;
}

function textFromReactNode(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromReactNode).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textFromReactNode(node.props.children);
  return '';
}

/** If `pre` wraps a single ```mermaid fenced block, return its source. */
function mermaidSourceFromPreChildren(children: ReactNode): string | null {
  const nodes = Children.toArray(children);
  if (nodes.length !== 1 || !isValidElement(nodes[0])) return null;
  const code = nodes[0] as ReactElement<{ className?: string; children?: ReactNode }>;
  const cls = code.props.className ?? '';
  if (!/\blanguage-mermaid\b/.test(cls)) return null;
  return textFromReactNode(code.props.children).replace(/\n$/, '');
}

function linkOpensNewTab(href: string | undefined): boolean {
  if (!href || href.startsWith('#')) return false;
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//')
  );
}

/** Shared Markdown renderer: GFM (tables, strikethrough, task lists, autolinks). */
export function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ children, ...props }) => {
          const mermaidSrc = mermaidSourceFromPreChildren(children);
          if (mermaidSrc !== null) {
            return <MermaidBlock chart={mermaidSrc} />;
          }
          return <pre {...props}>{children}</pre>;
        },
        input: (props) => (
          <input {...props} className="mr-2 align-middle accent-md-sky-strong" disabled readOnly />
        ),
        a: ({ href, children, ...props }) => {
          const external = linkOpensNewTab(href);
          return (
            <a
              href={href}
              {...props}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
