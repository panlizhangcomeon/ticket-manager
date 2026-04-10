import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { TagForm } from '../components/TagForm';
import { TagBadge } from '../components/TagBadge';
import { EmptyState } from '../components/EmptyState';
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '../hooks/useTags';
import { useToast } from '../hooks/useToast';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../types/tag';

interface TagManagerProps {
  onClose?: () => void;
}

export function TagManager({ onClose }: TagManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>();

  const { data: tags = [], isLoading, error } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();
  const { showToast, ToastContainer } = useToast();

  const handleCreate = () => {
    setEditingTag(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormOpen(true);
  };

  const handleSubmit = async (data: CreateTagRequest | UpdateTagRequest) => {
    try {
      if (editingTag) {
        await updateTag.mutateAsync({ id: editingTag.id, data: data as UpdateTagRequest });
        showToast('标签更新成功', 'success');
      } else {
        await createTag.mutateAsync(data as CreateTagRequest);
        showToast('标签创建成功', 'success');
      }
      setFormOpen(false);
      setEditingTag(undefined);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？删除后，所有关联的 Ticket 将不再显示此标签。')) {
      return;
    }
    try {
      await deleteTag.mutateAsync(id);
      showToast('标签删除成功', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '删除失败', 'error');
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b-2 border-md-graphite p-6 pb-6 sm:px-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow font-bold uppercase tracking-wider text-md-slate">组织</p>
            <h2 className="mt-1 text-2xl font-bold uppercase tracking-wide text-md-ink">标签管理</h2>
            <p className="mt-2 text-sm text-md-slate">为 Tickets 打上色块标签，列表与详情里一眼可辨。</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-struct border-2 border-md-graphite bg-md-cloud p-2 text-md-slate transition-[transform,box-shadow] duration-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md-lift hover:text-md-ink"
              aria-label="关闭"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <Button type="button" onClick={handleCreate} className="mt-6">
          + 新建标签
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:pb-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-sm font-semibold text-md-slate">
            加载中…
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-struct border-2 border-md-graphite bg-md-fog px-5 py-4 text-sm font-semibold text-red-800">
            {error instanceof Error ? error.message : '加载失败'}
          </div>
        )}

        {!isLoading && !error && tags.length === 0 && (
          <EmptyState message="还没有标签，创建一个吧！" />
        )}

        {!isLoading && !error && tags.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {tags.map((tag) => (
              <Card
                key={tag.id}
                className="group transition-[transform,box-shadow] duration-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md-lift"
              >
                <CardContent className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <TagBadge tag={tag} />
                    <div className="flex gap-1 opacity-100 transition-opacity duration-md sm:opacity-0 sm:group-hover:opacity-100">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)} className="normal-case">
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tag.id)}
                        className="normal-case text-md-slate hover:text-red-700"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <TagForm
        tag={editingTag}
        onSubmit={handleSubmit}
        onCancel={() => {
          setFormOpen(false);
          setEditingTag(undefined);
        }}
        open={formOpen}
      />
      <ToastContainer />
    </div>
  );
}
