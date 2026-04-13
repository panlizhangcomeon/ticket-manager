import { useParams, useNavigate } from 'react-router-dom';
import { MarkdownContent } from '../components/MarkdownContent';
import { useTicket, useToggleComplete } from '../hooks/useTickets';
import { useTags } from '../hooks/useTags';
import { useToast } from '../hooks/useToast';
import { TagBadge } from '../components/TagBadge';
import { Button } from '../components/ui/button';

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = Number(id);

  const { data: ticket, isLoading, error } = useTicket(ticketId);
  useTags();
  const toggleComplete = useToggleComplete();
  const { showToast, ToastContainer } = useToast();

  const handleToggleComplete = async () => {
    if (!ticket) return;
    try {
      await toggleComplete.mutateAsync({ id: ticket.id, is_completed: !ticket.is_completed });
      showToast(ticket.is_completed ? '已标记为未完成' : '已完成', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-md-graphite border-t-md-sky"
          aria-hidden
        />
        <p className="mt-4 text-sm font-semibold text-md-slate">加载中…</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 rounded-struct border-2 border-transparent px-3 py-2 text-sm font-semibold text-md-slate transition-colors hover:border-md-graphite hover:text-md-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <div className="rounded-struct border-2 border-md-graphite bg-md-fog px-6 py-5 text-sm font-semibold text-red-800">
          {error instanceof Error ? error.message : '加载失败'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[60vw] px-4 py-6 sm:px-6">
      <button
        type="button"
        onClick={handleBack}
        className="group mb-6 flex items-center gap-2 rounded-struct border-2 border-transparent px-3 py-2 text-sm font-semibold text-md-slate transition-colors hover:border-md-graphite hover:text-md-ink"
      >
        <svg
          className="h-4 w-4 transition-transform duration-md group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      <article className="overflow-visible rounded-struct border-2 border-md-graphite bg-md-cloud shadow-md-lift">
        <div className="border-b-2 border-md-graphite bg-md-soft-blue px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1
              className={`text-2xl font-bold uppercase tracking-wide sm:text-[28px] sm:leading-tight ${
                ticket.is_completed ? 'text-md-slate line-through' : 'text-md-ink'
              }`}
            >
              {ticket.title}
            </h1>
            <Button
              type="button"
              onClick={handleToggleComplete}
              disabled={toggleComplete.isPending}
              variant={ticket.is_completed ? 'secondary' : 'default'}
              className={`shrink-0 ${ticket.is_completed ? 'normal-case' : ''}`}
            >
              {ticket.is_completed ? '✓ 已完成' : '标记完成'}
            </Button>
          </div>

          {ticket.tags && ticket.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="border-b-2 border-md-graphite px-6 py-8 sm:px-8">
          <h2 className="mb-4 text-eyebrow font-bold uppercase tracking-wider text-md-slate">描述</h2>
          <div className="prose-md-ticket max-w-none text-[15px] leading-relaxed">
            {ticket.description ? (
              <MarkdownContent>{ticket.description}</MarkdownContent>
            ) : (
              <p className="text-md-slate italic">暂无描述</p>
            )}
          </div>
        </div>

        <div className="md-graph-paper px-6 py-8 sm:px-8">
          <div className="flex flex-wrap gap-8">
            <div className="flex min-w-[140px] flex-col gap-1">
              <span className="text-eyebrow font-bold uppercase tracking-wider text-md-slate">状态</span>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full border-2 border-md-graphite ${
                    ticket.is_completed ? 'bg-md-sky' : 'bg-md-sunbeam'
                  }`}
                />
                <span className={`text-sm font-semibold ${ticket.is_completed ? 'text-md-ink' : 'text-md-ink'}`}>
                  {ticket.is_completed ? '已完成' : '待完成'}
                </span>
              </div>
            </div>

            <div className="flex min-w-[180px] flex-col gap-1">
              <span className="text-eyebrow font-bold uppercase tracking-wider text-md-slate">创建时间</span>
              <span className="font-mono text-sm text-md-ink">
                {new Date(ticket.created_at).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex min-w-[180px] flex-col gap-1">
              <span className="text-eyebrow font-bold uppercase tracking-wider text-md-slate">更新时间</span>
              <span className="font-mono text-sm text-md-ink">
                {ticket.updated_at
                  ? new Date(ticket.updated_at).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </article>

      <ToastContainer />
    </div>
  );
}
