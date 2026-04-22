import { Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutorReviews } from "@/hooks/useTutorReviews";

export default function TutorReviews() {
  const { data, isLoading } = useTutorReviews();

  if (isLoading || !data) {
    return (
      <>
        <PageHeader title="Reviews" description="What your students say" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
        </div>
      </>
    );
  }

  const fiveStar = data.reviews.filter((r) => Number(r.rating) === 5).length;

  return (
    <>
      <PageHeader title="Reviews" description="What your students say about you" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg Rating" value={data.avg ? data.avg.toFixed(1) : "—"} icon={Star} positive />
        <StatCard label="Total Reviews" value={data.total.toString()} />
        <StatCard label="5-Star" value={fiveStar.toString()} positive />
        <StatCard label="Satisfaction" value={data.total ? `${Math.round((fiveStar / data.total) * 100)}%` : "—"} positive />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {data.breakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 w-16">
                  {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}
                </div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-warning transition-all duration-500" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bento-card">
          <h3 className="font-bold text-foreground mb-4">Recent Reviews</h3>
          {data.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No reviews yet — once your students leave reviews they'll appear here.</p>
          ) : (
            <div className="space-y-4">
              {data.reviews.map((r: any) => (
                <div key={r.id} className="p-4 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                        {r.student?.avatar_url ? <img src={r.student.avatar_url} className="w-full h-full object-cover" alt="" /> : (r.student?.full_name || "S")[0]}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{r.student?.full_name || "Student"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(Number(r.rating))].map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
