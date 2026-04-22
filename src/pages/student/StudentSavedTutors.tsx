import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useSavedTutors, useToggleSavedTutor } from "@/hooks/useSavedTutors";
import { useTutorCategories } from "@/hooks/useTutors";
import { toast } from "sonner";

export default function StudentSavedTutors() {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const { data: cats } = useTutorCategories();
  const { data: tutors, isLoading } = useSavedTutors({ category, subject });
  const toggle = useToggleSavedTutor();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const subjectsForCat = cats?.find(c => c.category === category)?.subjects || [];

  return (
    <>
      <PageHeader title="Saved Tutors" description={isLoading ? "Loading..." : `${tutors?.length || 0} tutors saved`} />

      <div className="bento-card mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted-foreground mr-2">Category:</span>
        <button onClick={() => { setCategory(""); setSubject(""); }} className={`px-3 py-1.5 text-xs rounded-full ${!category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>All</button>
        {(cats || []).map(c => (
          <button key={c.category} onClick={() => { setCategory(c.category); setSubject(""); }} className={`px-3 py-1.5 text-xs rounded-full ${category === c.category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>{c.category}</button>
        ))}
      </div>

      {category && subjectsForCat.length > 0 && (
        <div className="bento-card mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground mr-2">Subject:</span>
          <button onClick={() => setSubject("")} className={`px-3 py-1.5 text-xs rounded-full ${!subject ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>All</button>
          {subjectsForCat.map(s => (
            <button key={s} onClick={() => setSubject(s)} className={`px-3 py-1.5 text-xs rounded-full ${subject === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>{s}</button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : !tutors?.length ? (
        <div className="bento-card">
          <EmptyState icon={Heart} title="No saved tutors" description="Browse tutors and save your favorites for quick access" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.map((t) => (
            <div key={t.id} className="bento-card group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary overflow-hidden">
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.full_name} className="w-full h-full object-cover" /> : t.full_name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{t.full_name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{t.category}</p>
                </div>
                <button
                  disabled={pendingId === t.user_id}
                  onClick={() => {
                    setPendingId(t.user_id);
                    toggle.mutate({ tutorUserId: t.user_id, currentlySaved: true }, {
                      onSuccess: () => toast.success("Removed from saved"),
                      onError: () => toast.error("Couldn't update"),
                      onSettled: () => setPendingId(null),
                    });
                  }}
                  className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                >
                  {pendingId === t.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-current" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">{t.bio}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-semibold">{t.avg_rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({t.total_reviews})</span>
                </div>
                <span className="text-sm font-bold text-primary">${t.hourly_rate}/hr</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/tutors/${t.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full border-white/[0.08] rounded-xl">View Profile</Button>
                </Link>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 rounded-xl">
                  <Calendar className="w-3 h-3 mr-1" />Book
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
