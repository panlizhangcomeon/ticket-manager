import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  children: string;
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
