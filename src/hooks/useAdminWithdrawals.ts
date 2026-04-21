import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminWithdrawals(opts: { status?: string } = {}) {
  const { status = "" } = opts;
  return useQuery({
    queryKey: ["admin-withdrawals", { status }],
    queryFn: async () => {
      let q = supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      const { data, error } = await q;
      if (error) throw error;

      const tids = Array.from(new Set((data || []).map((w: any) => w.tutor_id)));
      const { data: profs } = tids.length
        ? await supabase.from("profiles").select("user_id, full_name, email, avatar_url").in("user_id", tids)
        : { data: [] as any[] };
      const pmap = new Map((profs || []).map((p: any) => [p.user_id, p]));
      return (data || []).map((w: any) => ({ ...w, tutor: pmap.get(w.tutor_id) || null }));
    },
  });
}

export function useProcessWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; approve: boolean; reason?: string }) => {
      const { error } = await (supabase as any).rpc("process_withdrawal", {
        _withdrawal_id: input.id,
        _approve: input.approve,
        _reason: input.reason || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
    },
  });
}
