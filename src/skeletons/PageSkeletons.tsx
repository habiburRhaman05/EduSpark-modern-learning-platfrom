import { Skeleton } from "@/components/ui/skeleton";

export function TutorListingSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bento-card space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function TutorDetailsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="bento-card">
          <Skeleton className="h-32 rounded-xl mb-6" />
          <div className="pt-4 pl-28 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="bento-card space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="lg:w-80">
        <div className="bento-card space-y-4">
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BlogListingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bento-card space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function SessionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bento-card">
        <div className="flex gap-6">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bento-card space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="bento-card space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CategoryExploreSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bento-card flex flex-col items-center text-center py-8 space-y-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
