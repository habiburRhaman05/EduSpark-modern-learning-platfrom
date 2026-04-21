import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useTutorEarnings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tutor-earnings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount, net_amount, platform_fee, status, created_at")
        .eq("payee_id", user!.id)
        .order("created_at", { ascending: false });

      const all = payments || [];
      const completed = all.filter((p) => p.status === "completed");
      const pending = all.filter((p) => p.status === "pending");

      const totalEarned = completed.reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0);
      const pendingPayouts = pending.reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0);

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = completed
        .filter((p) => new Date(p.created_at) >= thisMonthStart)
        .reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0);
      const lastMonth = completed
        .filter((p) => {
          const d = new Date(p.created_at);
          return d >= lastMonthStart && d < thisMonthStart;
        })
        .reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0);

      // Available balance from tutor_profiles
      const { data: tp } = await supabase
        .from("tutor_profiles")
        .select("available_balance")
        .eq("user_id", user!.id)
        .maybeSingle();
      const availableBalance = Number(tp?.available_balance ?? totalEarned - pendingPayouts);

      // Weekly chart
      const weekly = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        const dayPay = completed.filter((p) => p.created_at?.slice(0, 10) === key);
        return {
          name: d.toLocaleDateString("en-US", { weekday: "short" }),
          earnings: dayPay.reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0),
        };
      });

      // Monthly trend (6 months)
      const monthly = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const next = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
        const sum = completed
          .filter((p) => {
            const x = new Date(p.created_at);
            return x >= d && x < next;
          })
          .reduce((s, p) => s + Number(p.net_amount ?? p.amount ?? 0), 0);
        return { name: d.toLocaleDateString("en-US", { month: "short" }), earnings: sum };
      });

      const recent = all.slice(0, 8);

      return {
        availableBalance,
        pendingPayouts,
        thisMonth,
        lastMonth,
        totalEarned,
        weekly,
        monthly,
        recent,
      };
    },
  });
}
