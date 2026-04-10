import type { Tag } from '../types/tag';

type StatusFilter = 'all' | 'pending' | 'completed';

interface SidebarProps {
  tags: Tag[];
  tagCounts: Record<number, number>;
  selectedStatus: StatusFilter;
  selectedTagId: number | null;
  allCount: number;
  pendingCount: number;
  completedCount: number;
  onStatusChange: (status: StatusFilter) => void;
  onTagChange: (tagId: number | null) => void;
}

export function Sidebar({
  tags,
  tagCounts,
  selectedStatus,
  selectedTagId,
  allCount,
  pendingCount,
  completedCount,
  onStatusChange,
  onTagChange,
}: SidebarProps) {
  const statusItems: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: allCount },
    { key: 'pending', label: '待完成', count: pendingCount },
    { key: 'completed', label: '已完成', count: completedCount },
  ];

  return (
    <aside className="w-full shrink-0 border-b-2 border-md-graphite bg-md-soft-blue md:w-64 md:border-b-0 md:border-r-2">
      <nav className="p-4" aria-label="筛选">
        <div className="mb-6">
          <h3 className="mb-3 px-2 text-eyebrow font-bold uppercase tracking-wider text-md-slate">
            状态
          </h3>
          <div className="space-y-1">
            {statusItems.map((item) => {
              const active = selectedStatus === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onStatusChange(item.key)}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-struct border-2 px-3 py-2.5 text-left text-sm font-semibold transition-[transform,box-shadow] duration-md ease-in-out ${
                    active
                      ? 'border-md-graphite bg-md-sunbeam text-md-ink shadow-md-lift -translate-x-1 -translate-y-1 ring-2 ring-md-graphite ring-offset-2 ring-offset-md-soft-blue'
                      : 'border-md-graphite bg-md-cloud text-md-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md-lift'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-struct border-2 ${
                        active ? 'border-md-graphite bg-md-graphite' : 'border-transparent bg-transparent'
                      }`}
                      aria-hidden
                    >
                      {active && (
                        <svg className="h-3 w-3 text-md-sunbeam" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {item.label}
                  </span>
                  <span
                    className={`rounded-struct border-2 px-2 py-0.5 font-mono text-xs ${
                      active
                        ? 'border-md-graphite bg-md-cloud text-md-ink'
                        : 'border-md-graphite bg-md-fog text-md-slate'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 px-2 text-eyebrow font-bold uppercase tracking-wider text-md-slate">
            标签
          </h3>
          <div className="space-y-1">
            {tags.map((tag) => {
              const active = selectedTagId === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onTagChange(tag.id)}
                  className={`flex w-full items-center justify-between rounded-struct border-2 px-3 py-2.5 text-left text-sm font-semibold transition-[transform,box-shadow] duration-md ease-in-out ${
                    active
                      ? 'border-md-graphite bg-md-sky text-md-ink shadow-md-lift -translate-x-1 -translate-y-1'
                      : 'border-md-graphite bg-md-cloud text-md-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md-lift'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border-2 border-md-graphite"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="truncate">{tag.name}</span>
                  </div>
                  <span
                    className={`ml-2 shrink-0 rounded-struct border-2 px-2 py-0.5 font-mono text-xs ${
                      active
                        ? 'border-md-graphite bg-md-cloud text-md-ink'
                        : 'border-md-graphite bg-md-fog text-md-slate'
                    }`}
                  >
                    {tagCounts[tag.id] || 0}
                  </span>
                </button>
              );
            })}
            {tags.length === 0 && (
              <p className="px-3 py-2 text-sm text-md-slate">暂无标签 · 去 header 打开「管理标签」</p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
