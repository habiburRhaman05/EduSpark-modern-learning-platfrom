import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TutorListItem } from "./useTutors";

export function useSavedTutorIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-tutor-ids", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_tutors").select("tutor_id").eq("student_id", user!.id);
      if (error) throw error;
      return new Set((data || []).map((r: any) => r.tutor_id as string));
    },
  });
}

export function useSavedTutors(filters: { category?: string; subject?: string } = {}) {
  const { user } = useAuth();
  const { category = "", subject = "" } = filters;
  return useQuery({
    queryKey: ["saved-tutors", user?.id, { category, subject }],
    enabled: !!user,
    queryFn: async () => {
      // 1. saved tutor user_ids
      const { data: saved, error } = await supabase
        .from("saved_tutors")
        .select("tutor_id, created_at")
        .eq("student_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const ids = (saved || []).map((s: any) => s.tutor_id);
      if (ids.length === 0) return [] as TutorListItem[];

      // 2. tutor_profiles (no inner join — fetch separately to avoid FK requirement)
      let q = supabase
        .from("tutor_profiles")
        .select("id, user_id, headline, category, subjects, hourly_rate, avg_rating, total_reviews, total_sessions, is_verified")
        .in("user_id", ids);
      if (category) q = q.eq("category", category);
      if (subject) q = q.contains("subjects", [subject]);
      const { data: tps, error: e2 } = await q;
      if (e2) throw e2;
      if (!tps || tps.length === 0) return [] as TutorListItem[];

      // 3. profiles (names + avatars)
      const userIds = tps.map((t: any) => t.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, bio")
        .in("user_id", userIds);
      const profMap = new Map((profs || []).map((p: any) => [p.user_id, p]));

      // 4. preserve saved order
      const orderMap = new Map(ids.map((id: string, i: number) => [id, i]));
      return tps
        .map((row: any): TutorListItem => {
          const p = profMap.get(row.user_id) as any;
          return {
            id: row.id,
            user_id: row.user_id,
            full_name: p?.full_name || "Tutor",
            avatar_url: p?.avatar_url || null,
            bio: row.headline || p?.bio || "",
            category: row.category,
            subjects: row.subjects || [],
            hourly_rate: Number(row.hourly_rate || 0),
            avg_rating: Number(row.avg_rating || 0),
            total_reviews: row.total_reviews || 0,
            total_sessions: row.total_sessions || 0,
            is_verified: !!row.is_verified,
          };
        })
        .sort((a, b) => (orderMap.get(a.user_id) ?? 0) - (orderMap.get(b.user_id) ?? 0));
    },
  });
}

export function useToggleSavedTutor() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ tutorUserId, currentlySaved }: { tutorUserId: string; currentlySaved: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (currentlySaved) {
        const { error } = await supabase.from("saved_tutors").delete().eq("student_id", user.id).eq("tutor_id", tutorUserId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saved_tutors").insert({ student_id: user.id, tutor_id: tutorUserId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-tutor-ids"] });
      qc.invalidateQueries({ queryKey: ["saved-tutors"] });
    },
  });
}
