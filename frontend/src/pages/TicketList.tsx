import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TicketCard } from '../components/TicketCard';
import { TicketForm } from '../components/TicketForm';
import { Sidebar } from '../components/Sidebar';
import { EmptyState } from '../components/EmptyState';
import { TicketListSkeleton } from '../components/LoadingSkeleton';
import { useTickets, useToggleComplete, useCreateTicket, useUpdateTicket, useDeleteTicket } from '../hooks/useTickets';
import { useTags } from '../hooks/useTags';
import { useToast } from '../hooks/useToast';
import type { Ticket, CreateTicketRequest, UpdateTicketRequest } from '../types/ticket';

type StatusFilter = 'all' | 'pending' | 'completed';
type SortBy = 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc';

interface TicketListProps {
  globalSearch?: string;
  onOpenTagManager?: () => void;
}

const sortSelectClass =
  'h-10 cursor-pointer rounded-struct border-2 border-md-graphite bg-md-cloud px-3 text-sm font-semibold text-md-ink focus:outline-none focus:border-md-sky-strong';

export function TicketList({ globalSearch = '' }: TicketListProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('created_desc');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const st = location.state as { openCreateTicket?: boolean } | null;
    if (!st?.openCreateTicket) return;
    setEditingTicket(undefined);
    setFormOpen(true);
    navigate('.', { replace: true, state: {} });
  }, [location.state, navigate]);

  const { data: allTickets = [], isLoading, error } = useTickets({
    keyword: globalSearch || undefined,
  });

  const { data: tags = [] } = useTags();
  const toggleComplete = useToggleComplete();
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const { showToast, ToastContainer } = useToast();

  const stats = useMemo(() => {
    const pending = allTickets.filter(t => !t.is_completed).length;
    const completed = allTickets.filter(t => t.is_completed).length;

    const tagCounts: Record<number, number> = {};
    allTickets.forEach(ticket => {
      if (ticket.tags) {
        ticket.tags.forEach(tag => {
          tagCounts[tag.id] = (tagCounts[tag.id] || 0) + 1;
        });
      }
    });

    return {
      all: allTickets.length,
      pending,
      completed,
      tagCounts,
    };
  }, [allTickets]);

  const filteredTickets = useMemo(() => {
    let result = [...allTickets];

    if (selectedStatus === 'pending') {
      result = result.filter(t => !t.is_completed);
    } else if (selectedStatus === 'completed') {
      result = result.filter(t => t.is_completed);
    }

    if (selectedTagId !== null) {
      result = result.filter(ticket =>
        ticket.tags?.some(tag => tag.id === selectedTagId)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [allTickets, selectedStatus, selectedTagId, sortBy]);

  const handleCreate = () => {
    setEditingTicket(undefined);
    setFormOpen(true);
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormOpen(true);
  };

  const handleSubmit = async (data: CreateTicketRequest | UpdateTicketRequest) => {
    try {
      if (editingTicket) {
        await updateTicket.mutateAsync({ id: editingTicket.id, data: data as UpdateTicketRequest });
        showToast('Ticket 更新成功', 'success');
      } else {
        await createTicket.mutateAsync(data as CreateTicketRequest);
        showToast('Ticket 创建成功', 'success');
      }
      setFormOpen(false);
      setEditingTicket(undefined);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个 Ticket 吗？')) {
      return;
    }
    try {
      await deleteTicket.mutateAsync(id);
      showToast('Ticket 删除成功', 'success');
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : '删除失败', 'error');
    }
  };

  const handleToggleComplete = async (id: number, is_completed: boolean) => {
    try {
      await toggleComplete.mutateAsync({ id, is_completed });
      showToast(is_completed ? 'Ticket 已完成' : 'Ticket 已恢复', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error');
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTickets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTickets.map(t => t.id)));
    }
  };

  const handleBatchComplete = async () => {
    try {
      for (const id of selectedIds) {
        await toggleComplete.mutateAsync({ id, is_completed: true });
      }
      showToast('批量完成成功', 'success');
      setSelectedIds(new Set());
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error');
    }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个 Ticket 吗？`)) {
      return;
    }
    try {
      for (const id of selectedIds) {
        await deleteTicket.mutateAsync(id);
      }
      showToast('批量删除成功', 'success');
      setSelectedIds(new Set());
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error');
    }
  };

  const listTitle =
    selectedTagId !== null
      ? tags.find(t => t.id === selectedTagId)?.name ?? '标签'
      : selectedStatus === 'all'
        ? '所有任务'
        : selectedStatus === 'pending'
          ? '待完成'
          : '已完成';

  return (
    <div className="flex min-h-full w-full flex-col md:flex-row">
      <Sidebar
        tags={tags}
        tagCounts={stats.tagCounts}
        selectedStatus={selectedStatus}
        selectedTagId={selectedTagId}
        allCount={stats.all}
        pendingCount={stats.pending}
        completedCount={stats.completed}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setSelectedTagId(null);
        }}
        onTagChange={setSelectedTagId}
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b-2 border-md-graphite pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow font-bold uppercase tracking-wider text-md-slate">当前视图</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-md-ink sm:text-[28px] sm:leading-tight">
                {listTitle}
              </h1>
              <span className="font-mono text-sm text-md-slate">({filteredTickets.length})</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="sort-tickets">
              排序
            </label>
            <select
              id="sort-tickets"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className={sortSelectClass}
            >
              <option value="created_desc">最新创建</option>
              <option value="created_asc">最早创建</option>
              <option value="title_asc">标题 A-Z</option>
              <option value="title_desc">标题 Z-A</option>
            </select>

            <Button type="button" onClick={handleCreate}>
              + 新建 Ticket
            </Button>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div
            className="mb-4 flex flex-wrap items-center gap-3 rounded-struct border-2 border-md-graphite bg-md-sunbeam px-4 py-3"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm font-semibold text-md-ink">
              已选择 {selectedIds.size} 项
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm font-semibold text-md-ink underline decoration-2 underline-offset-2 hover:text-md-graphite"
            >
              {selectedIds.size === filteredTickets.length ? '取消全选' : '全选当前列表'}
            </button>
            <div className="flex-1" />
            <Button type="button" size="sm" onClick={handleBatchComplete}>
              批量完成
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={handleBatchDelete}>
              批量删除
            </Button>
          </div>
        )}

        {isLoading && <TicketListSkeleton />}

        {error && (
          <div className="mb-6 rounded-struct border-2 border-md-graphite bg-md-fog px-5 py-4 text-sm font-semibold text-red-800">
            {error instanceof Error ? error.message : '加载失败'}
          </div>
        )}

        {!isLoading && !error && filteredTickets.length === 0 && (
          <EmptyState message={globalSearch || selectedTagId ? '没有找到匹配的任务' : '还没有任务，创建一个吧！'} />
        )}

        {!isLoading && !error && filteredTickets.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                selected={selectedIds.has(ticket.id)}
                onSelect={handleSelect}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <TicketForm
          ticket={editingTicket}
          tags={tags}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditingTicket(undefined);
          }}
          open={formOpen}
        />
        <ToastContainer />
      </div>
    </div>
  );
}
