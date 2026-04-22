import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className="bento-card space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bento-card">
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bento-card space-y-3">
      <Skeleton className="h-5 w-40 mb-2" />
      <Skeleton className="h-10 w-full rounded-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
