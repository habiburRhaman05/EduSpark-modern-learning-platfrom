import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useStudentPayments(opts: { status?: string; page?: number; pageSize?: number; search?: string } = {}) {
  const { user } = useAuth();
  const { status = "", page = 1, pageSize = 8, search = "" } = opts;
  return useQuery({
    queryKey: ["student-payments", user?.id, { status, page, pageSize, search }],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase
        .from("payments")
        .select("*", { count: "exact" })
        .eq("payer_id", user!.id)
        .order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      if (search) q = q.ilike("transaction_ref", `%${search}%`);
      const from = (page - 1) * pageSize;
      q = q.range(from, from + pageSize - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      return { items: data || [], total: count || 0, totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)) };
    },
  });
}

export function useStudentPaymentStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["student-payment-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("payments").select("amount, status").eq("payer_id", user!.id);
      const rows = data || [];
      const isPaid = (s: string | null) => s === "completed" || s === "credited";
      return {
        totalPaid: rows.filter(r => isPaid(r.status)).reduce((s, r) => s + Number(r.amount), 0),
        count: rows.length,
        successful: rows.filter(r => isPaid(r.status)).length,
        pending: rows.filter(r => r.status === "pending").length,
      };
    },
  });
}
