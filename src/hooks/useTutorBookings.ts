import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useTutorBookings(opts: { status?: string; page?: number; pageSize?: number; search?: string } = {}) {
  const { user } = useAuth();
  const { status = "", page = 1, pageSize = 8, search = "" } = opts;

  return useQuery({
    queryKey: ["tutor-bookings", user?.id, { status, page, pageSize, search }],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .eq("tutor_id", user!.id)
        .order("scheduled_at", { ascending: false });
      if (status) q = q.eq("status", status);
      if (search) q = q.ilike("subject", `%${search}%`);
      const from = (page - 1) * pageSize;
      q = q.range(from, from + pageSize - 1);

      const { data, error, count } = await q;
      if (error) throw error;

      const sids = Array.from(new Set((data || []).map((b: any) => b.student_id)));
      const { data: profs } = sids.length
        ? await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", sids)
        : { data: [] as any[] };
      const pmap = new Map((profs || []).map((p: any) => [p.user_id, p]));
      const items = (data || []).map((b: any) => ({ ...b, student: pmap.get(b.student_id) || null }));

      return { items, total: count || 0, totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)) };
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
      // When marking completed, credit the tutor's earnings via RPC
      if (status === "completed") {
        const { error: rpcErr } = await (supabase as any).rpc("credit_tutor_for_booking", { _booking_id: id });
        if (rpcErr) console.warn("credit_tutor_for_booking failed", rpcErr);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tutor-bookings"] });
      qc.invalidateQueries({ queryKey: ["tutor-dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["tutor-upcoming-classes"] });
      qc.invalidateQueries({ queryKey: ["tutor-earnings"] });
      qc.invalidateQueries({ queryKey: ["my-tutor-profile"] });
    },
  });
}
