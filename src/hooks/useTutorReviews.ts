import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useTutorReviews() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tutor-reviews", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, student_id, booking_id")
        .eq("tutor_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data || [];
      const sids = Array.from(new Set(rows.map((r) => r.student_id)));
      const { data: profs } = sids.length
        ? await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", sids)
        : { data: [] as any[] };
      const pmap = new Map((profs || []).map((p: any) => [p.user_id, p]));
      const reviews = rows.map((r) => ({ ...r, student: pmap.get(r.student_id) || null }));

      const total = reviews.length;
      const avg = total ? reviews.reduce((s, r) => s + Number(r.rating), 0) / total : 0;
      const breakdown = [5, 4, 3, 2, 1].map((stars) => {
        const count = reviews.filter((r) => Number(r.rating) === stars).length;
        return { stars, count, pct: total ? Math.round((count / total) * 100) : 0 };
      });

      return { reviews, total, avg, breakdown };
    },
  });
}
