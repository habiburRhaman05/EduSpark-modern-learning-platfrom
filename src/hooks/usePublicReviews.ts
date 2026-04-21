import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  student: { full_name: string | null; avatar_url: string | null; role?: string | null } | null;
}

/** Fetch top published reviews to use as homepage testimonials. */
export function usePublicReviews(limit = 8) {
  return useQuery({
    queryKey: ["public-reviews", limit],
    queryFn: async (): Promise<PublicReview[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, student_id")
        .gte("rating", 4)
        .not("comment", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      const rows = data || [];
      const sids = Array.from(new Set(rows.map((r: any) => r.student_id).filter(Boolean)));
      const { data: profs } = sids.length
        ? await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", sids)
        : { data: [] as any[] };
      const pmap = new Map((profs || []).map((p: any) => [p.user_id, p]));
      return rows.map((r: any) => ({
        id: r.id,
        rating: Number(r.rating),
        comment: r.comment,
        created_at: r.created_at,
        student: pmap.get(r.student_id) || null,
      }));
    },
  });
}
