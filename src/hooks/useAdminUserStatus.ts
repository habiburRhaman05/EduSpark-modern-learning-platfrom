import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserStatus = "active" | "banned" | "suspended";

export function useUserStatuses(userIds: string[]) {
  return useQuery({
    queryKey: ["user-statuses", userIds.sort().join(",")],
    enabled: userIds.length > 0,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("user_status")
        .select("user_id, status")
        .in("user_id", userIds);
      if (error) throw error;
      const map = new Map<string, UserStatus>();
      (data || []).forEach((r: any) => map.set(r.user_id, r.status));
      return map;
    },
  });
}

export function useSetUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: UserStatus }) => {
      const { error } = await (supabase as any).rpc("set_user_status", {
        _user_id: userId,
        _status: status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-statuses"] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
