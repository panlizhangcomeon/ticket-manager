import { useState, useEffect } from 'react';
import { MarkdownContent } from './MarkdownContent';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import type { Ticket, CreateTicketRequest, UpdateTicketRequest } from '../types/ticket';
import type { Tag } from '../types/tag';

interface TicketFormProps {
  ticket?: Ticket;
  tags: Tag[];
  /** 新建时默认勾选的标签（例如当前列表按某标签筛选时） */
  defaultSelectedTagIds?: number[];
  onSubmit: (data: CreateTicketRequest | UpdateTicketRequest) => void;
  onCancel: () => void;
  open: boolean;
}

export function TicketForm({ ticket, tags, defaultSelectedTagIds, onSubmit, onCancel, open }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description || '');
      setSelectedTagIds(ticket.tags?.map(t => t.id) || []);
    } else {
      setTitle('');
      setDescription('');
      const raw = defaultSelectedTagIds ?? [];
      const valid = raw.filter((id) => tags.some((t) => t.id === id));
      setSelectedTagIds(valid);
    }
    setShowPreview(false);
  }, [ticket, open, defaultSelectedTagIds, tags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      tag_ids: selectedTagIds,
    });
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b-2 border-md-graphite bg-md-soft-blue px-6 py-5">
          <DialogTitle>
            {ticket ? '编辑 Ticket' : '创建 Ticket'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
            <div>
              <label htmlFor="ticket-title" className="mb-2 block text-eyebrow font-bold uppercase tracking-wider text-md-slate">
                标题 *
              </label>
              <Input
                id="ticket-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入 Ticket 标题"
                required
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label htmlFor="ticket-desc" className="text-eyebrow font-bold uppercase tracking-wider text-md-slate">
                  描述
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs font-semibold uppercase tracking-wide text-md-slate underline decoration-2 underline-offset-2 hover:text-md-ink"
                >
                  {showPreview ? '编辑' : '预览'}
                </button>
              </div>
              {showPreview ? (
                <div className="min-h-[160px] rounded-struct border-2 border-md-graphite bg-md-fog p-4">
                  {description ? (
                    <div className="prose-md-ticket prose-sm max-w-none text-[15px]">
                      <MarkdownContent>{description}</MarkdownContent>
                    </div>
                  ) : (
                    <p className="text-sm italic text-md-slate">暂无内容</p>
                  )}
                </div>
              ) : (
                <Textarea
                  id="ticket-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="支持 Markdown：**粗体**、列表、标题…"
                  rows={6}
                  className="resize-none font-mono text-sm"
                />
              )}
              <p className="mt-1.5 text-xs font-medium text-md-slate">支持 Markdown 语法</p>
            </div>
            <div>
              <span className="mb-2 block text-eyebrow font-bold uppercase tracking-wider text-md-slate">标签</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const checked = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`flex items-center gap-2 rounded-struct border-2 px-3 py-2 text-left text-sm font-semibold transition-[transform,box-shadow] duration-md ${
                        checked
                          ? 'border-md-graphite bg-md-sunbeam text-md-ink shadow-md-lift -translate-x-0.5 -translate-y-0.5'
                          : 'border-md-graphite bg-md-cloud text-md-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md-lift'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-struct border-2 border-md-graphite ${
                          checked ? 'bg-md-graphite' : 'bg-md-fog'
                        }`}
                      >
                        {checked && (
                          <svg className="h-3.5 w-3.5 text-md-sunbeam" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-md-graphite"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="truncate">{tag.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-0 border-t-2 border-md-graphite bg-md-cream px-6 py-4">
            <Button type="button" variant="ghost" onClick={onCancel} className="normal-case">
              取消
            </Button>
            <Button type="submit">{ticket ? '更新' : '创建'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
