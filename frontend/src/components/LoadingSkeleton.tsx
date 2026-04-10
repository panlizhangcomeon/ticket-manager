import { Card, CardContent, CardHeader } from './ui/card';

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-md-fog via-md-cloud to-md-fog bg-[length:200%_100%] animate-md-shimmer ${className ?? ''}`}
    />
  );
}

export function TicketCardSkeleton() {
  return (
    <Card className="overflow-hidden border-md-graphite bg-md-cloud">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-center space-x-3">
          <ShimmerBlock className="h-6 w-6 rounded-struct border-2 border-md-graphite" />
          <ShimmerBlock className="h-6 flex-1 rounded-struct border-2 border-md-graphite" />
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <div className="space-y-2">
          <ShimmerBlock className="h-4 w-full rounded-struct border border-md-grid-line" />
          <ShimmerBlock className="h-4 w-5/6 rounded-struct border border-md-grid-line" />
        </div>
        <div className="mt-4 flex gap-2">
          <ShimmerBlock className="h-7 w-16 rounded-struct border-2 border-md-graphite" />
          <ShimmerBlock className="h-7 w-20 rounded-struct border-2 border-md-graphite" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TicketListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </div>
  );
}
