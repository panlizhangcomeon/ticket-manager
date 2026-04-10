import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  children: string;
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
