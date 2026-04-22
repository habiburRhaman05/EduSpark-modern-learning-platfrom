import { Skeleton } from "@/components/ui/skeleton";

export function TutorDetailsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        {/* Hero */}
        <div className="bento-card overflow-hidden p-0">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="p-6 -mt-12 relative">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-card" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
              <div className="flex gap-2 mt-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        {/* Tabs row */}
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-xl" />)}
        </div>
        {/* Body card */}
        <div className="bento-card space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      {/* Right rail */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bento-card space-y-4 sticky top-24">
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="space-y-2 pt-4 border-t border-border">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
