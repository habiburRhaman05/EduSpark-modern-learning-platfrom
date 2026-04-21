import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useMyWithdrawals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-withdrawals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("tutor_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export interface WithdrawInput {
  amount: number;
  bank_name: string;
  account_number: string;
  routing_number?: string;
}

export function useRequestWithdrawal() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: WithdrawInput) => {
      if (!user) throw new Error("Not authenticated");

      // Check available balance
      const { data: tp } = await supabase
        .from("tutor_profiles")
        .select("available_balance")
        .eq("user_id", user.id)
        .maybeSingle();
      const available = Number(tp?.available_balance || 0);
      if (available < 10) throw new Error("You need at least $10 in available balance to withdraw");
      if (input.amount > available) throw new Error(`Insufficient balance. Available: $${available.toFixed(2)}`);
      if (input.amount < 10) throw new Error("Minimum withdrawal is $10");

      const { error } = await supabase.from("withdrawals").insert({
        tutor_id: user.id,
        amount: input.amount,
        bank_name: input.bank_name,
        account_number: input.account_number,
        routing_number: input.routing_number || null,
        status: "pending",
      });
      if (error) throw error;

      // Reserve the balance
      await supabase
        .from("tutor_profiles")
        .update({ available_balance: available - input.amount })
        .eq("user_id", user.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
      qc.invalidateQueries({ queryKey: ["tutor-earnings"] });
    },
  });
}
