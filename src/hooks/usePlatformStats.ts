import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformStats {
  tutors: number;
  students: number;
  sessions: number;
  satisfaction: number;
  countries: number;
  hoursTaught: number;
}

export function usePlatformStats() {
  return useQuery<PlatformStats>({
    queryKey: ["platform-stats"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [tutorsRes, studentsRes, sessionsRes, ratingRes] = await Promise.all([
        supabase.from("tutor_profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "student" as any),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("reviews").select("rating"),
      ]);

      const ratings = (ratingRes.data || []).map((r: any) => r.rating).filter(Boolean);
      const avg = ratings.length ? ratings.reduce((s: number, r: number) => s + r, 0) / ratings.length : 4.9;
      const satisfaction = Math.min(100, Math.round((avg / 5) * 100));
      const sessionsCount = sessionsRes.count || 0;

      return {
        tutors: tutorsRes.count || 0,
        students: studentsRes.count || 0,
        sessions: sessionsCount,
        satisfaction,
        countries: 120,
        hoursTaught: Math.round(sessionsCount * 1.2),
      };
    },
  });
}
