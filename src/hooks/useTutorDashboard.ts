import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/** Resolve current user's tutor_profiles.id (creating one if missing) */
export function useTutorProfileId() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tutor-profile-id", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("tutor_profiles")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (data) return data.id as string;
      const { data: created, error } = await supabase
        .from("tutor_profiles")
        .insert({ user_id: user!.id })
        .select("id")
        .single();
      if (error) throw error;
      return created.id as string;
    },
  });
}

export function useTutorDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tutor-dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: bookings }, { data: payments }, { data: reviews }] = await Promise.all([
        supabase.from("bookings").select("id, student_id, status, scheduled_at, amount").eq("tutor_id", user!.id),
        supabase.from("payments").select("amount, net_amount, status, created_at").eq("payee_id", user!.id),
        supabase.from("reviews").select("rating").eq("tutor_id", user!.id),
      ]);

      const allBookings = bookings || [];
      const allPayments = payments || [];
      const allReviews = reviews || [];

      const uniqueStudents = new Set(allBookings.map((b) => b.student_id)).size;
      const activeSessions = allBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
      const earnings = allPayments
        .filter((p) => p.status === "completed")
        .reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0);
      const avgRating = allReviews.length
        ? allReviews.reduce((s, r) => s + Number(r.rating), 0) / allReviews.length
        : 0;

      // Last 7 days chart data
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });
      const chart = days.map((d) => {
        const key = d.toISOString().slice(0, 10);
        const dayBookings = allBookings.filter((b) => b.scheduled_at?.slice(0, 10) === key);
        const dayPay = allPayments.filter((p) => p.status === "completed" && p.created_at?.slice(0, 10) === key);
        return {
          name: d.toLocaleDateString("en-US", { weekday: "short" }),
          sessions: dayBookings.length,
          revenue: dayPay.reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0),
        };
      });

      // Subject pie
      const subjMap: Record<string, number> = {};
      allBookings.forEach((b: any) => {
        const sub = b.subject || "Other";
        subjMap[sub] = (subjMap[sub] || 0) + 1;
      });
      const palette = ["hsl(239 84% 67%)", "hsl(170 76% 40%)", "hsl(38 92% 50%)", "hsl(199 89% 48%)", "hsl(280 70% 60%)"];
      const total = Object.values(subjMap).reduce((s, n) => s + n, 0) || 1;
      const pie = Object.entries(subjMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count], i) => ({ name, value: Math.round((count / total) * 100), fill: palette[i] }));

      return {
        totalStudents: uniqueStudents,
        activeSessions,
        earnings,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews: allReviews.length,
        chart,
        pie,
      };
    },
  });
}

export function useTutorUpcomingClasses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tutor-upcoming-classes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, subject, scheduled_at, status, student_id")
        .eq("tutor_id", user!.id)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5);
      const rows = data || [];
      const sids = Array.from(new Set(rows.map((r) => r.student_id)));
      const { data: profs } = sids.length
        ? await supabase.from("profiles").select("user_id, full_name").in("user_id", sids)
        : { data: [] as any[] };
      const pmap = new Map((profs || []).map((p: any) => [p.user_id, p.full_name]));
      return rows.map((r) => ({ ...r, student_name: pmap.get(r.student_id) || "Student" }));
    },
  });
}
