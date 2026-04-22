import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="bento-card space-y-4">
      <Skeleton className="h-48 w-full rounded-xl bg-muted" />
      <Skeleton className="h-4 w-3/4 bg-muted" />
      <Skeleton className="h-3 w-1/2 bg-muted" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 bg-muted" />
        <Skeleton className="h-8 w-20 bg-muted" />
      </div>
    </div>
  );
}
