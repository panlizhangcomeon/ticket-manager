export function EmptyState({ message = '暂无数据' }: { message?: string }) {
  return (
    <div className="md-graph-paper flex flex-col items-center justify-center rounded-struct border-2 border-md-graphite bg-md-cream px-6 py-16">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-struct border-2 border-md-graphite bg-md-sunbeam shadow-md-lift">
        <svg
          className="h-10 w-10 text-md-ink"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="max-w-md text-center text-lg font-semibold text-md-ink">{message}</p>
    </div>
  );
}
