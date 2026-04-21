import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useStudentDashboard() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["student-dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [bookings, payments, saved] = await Promise.all([
        supabase.from("bookings").select("id, subject, status, scheduled_at, duration_minutes, amount, tutor_id, created_at").eq("student_id", user!.id).order("scheduled_at", { ascending: false }),
        supabase.from("payments").select("amount, status").eq("payer_id", user!.id),
        supabase.from("saved_tutors").select("id", { count: "exact", head: true }).eq("student_id", user!.id),
      ]);

      const allBookings = bookings.data || [];
      const upcoming = allBookings.filter(b => new Date(b.scheduled_at) > new Date() && b.status !== "cancelled");
      const completed = allBookings.filter(b => b.status === "completed");
      const totalHours = completed.reduce((s, b) => s + ((b.duration_minutes || 60) / 60), 0);

      // tutor names for upcoming
      const tids = Array.from(new Set(upcoming.slice(0, 5).map(b => b.tutor_id)));
      const { data: profs } = tids.length ? await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", tids) : { data: [] };
      const pmap = new Map((profs || []).map((p: any) => [p.user_id, p]));

      // Last 7 days study hours chart
      const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday
      startOfWeek.setHours(0,0,0,0);
      const chartData = days.map((d, i) => {
        const dayStart = new Date(startOfWeek); dayStart.setDate(startOfWeek.getDate() + i);
        const dayEnd = new Date(dayStart); dayEnd.setDate(dayStart.getDate() + 1);
        const sessions = completed.filter(b => {
          const t = new Date(b.scheduled_at);
          return t >= dayStart && t < dayEnd;
        }).reduce((s, b) => s + ((b.duration_minutes || 60) / 60), 0);
        return { name: d, sessions };
      });

      // Subject pie
      const subjMap = new Map<string, number>();
      completed.forEach(b => subjMap.set(b.subject, (subjMap.get(b.subject) || 0) + 1));
      const totalSubj = Array.from(subjMap.values()).reduce((s, n) => s + n, 0) || 1;
      const palette = ["hsl(239, 84%, 67%)","hsl(160, 84%, 50%)","hsl(38, 92%, 60%)","hsl(0, 84%, 65%)","hsl(280, 84%, 65%)","hsl(200, 84%, 55%)"];
      const pieData = Array.from(subjMap.entries()).slice(0, 6).map(([name, n], i) => ({
        name, value: Math.round((n / totalSubj) * 100), fill: palette[i % palette.length],
      }));

      const recentBookings = allBookings.slice(0, 5).map(b => ({ ...b, tutorName: pmap.get(b.tutor_id)?.full_name || "Tutor" }));
      const upcomingClasses = upcoming.slice(0, 3).map(b => ({
        time: new Date(b.scheduled_at).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" }),
        title: b.subject,
        tutor: pmap.get(b.tutor_id)?.full_name || "Tutor",
        level: b.status,
      }));

      const totalSpent = (payments.data || []).filter(p => p.status === "completed").reduce((s, p) => s + Number(p.amount), 0);

      return {
        stats: [
          { label: "Study Hours", value: totalHours.toFixed(1), change: "+12%", positive: true },
          { label: "Sessions", value: String(allBookings.length), change: "+5", positive: true },
          { label: "Saved Tutors", value: String(saved.count || 0), change: "", positive: true },
          { label: "Total Spent", value: `$${totalSpent.toFixed(0)}`, change: "", positive: true },
        ],
        chartData,
        pieData: pieData.length ? pieData : [{ name: "No sessions yet", value: 100, fill: "hsl(230, 15%, 25%)" }],
        recentBookings,
        upcomingClasses,
        upcomingCount: upcoming.length,
      };
    },
  });
}
