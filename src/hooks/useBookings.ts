import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useStudentBookings(opts: { status?: string; page?: number; pageSize?: number; search?: string } = {}) {
  const { user } = useAuth();
  const { status = "", page = 1, pageSize = 8, search = "" } = opts;

  return useQuery({
    queryKey: ["student-bookings", user?.id, { status, page, pageSize, search }],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase
        .from("bookings")
        .select("*, tutor:profiles!bookings_tutor_id_fkey(full_name, avatar_url)", { count: "exact" })
        .eq("student_id", user!.id)
        .order("scheduled_at", { ascending: false });

      if (status) q = q.eq("status", status);
      if (search) q = q.ilike("subject", `%${search}%`);

      const from = (page - 1) * pageSize;
      q = q.range(from, from + pageSize - 1);

      const { data, error, count } = await q;
      if (error) {
        // fallback without alias join
        let q2 = supabase
          .from("bookings")
          .select("*", { count: "exact" })
          .eq("student_id", user!.id)
          .order("scheduled_at", { ascending: false });
        if (status) q2 = q2.eq("status", status);
        if (search) q2 = q2.ilike("subject", `%${search}%`);
        q2 = q2.range(from, from + pageSize - 1);
        const r = await q2;
        if (r.error) throw r.error;
        // fetch tutor names separately
        const tids = Array.from(new Set((r.data || []).map((b: any) => b.tutor_id)));
        const { data: profs } = await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", tids);
        const pmap = new Map((profs || []).map((p: any) => [p.user_id, p]));
        const items = (r.data || []).map((b: any) => ({ ...b, tutor: pmap.get(b.tutor_id) || null }));
        return { items, total: r.count || 0, totalPages: Math.max(1, Math.ceil((r.count || 0) / pageSize)) };
      }
      return { items: data || [], total: count || 0, totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)) };
    },
  });
}

export function useBooking(id: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["booking", id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const { data: tutor } = await supabase.from("profiles").select("user_id, full_name, avatar_url, bio").eq("user_id", data.tutor_id).maybeSingle();
      return { ...data, tutor };
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled", cancelled_by: user!.id, cancellation_reason: "Cancelled by student" })
        .eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-bookings"] });
      qc.invalidateQueries({ queryKey: ["booking"] });
      qc.invalidateQueries({ queryKey: ["student-dashboard-stats"] });
    },
  });
}
