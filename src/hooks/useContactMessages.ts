import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  user_id?: string | null;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (input: ContactInput) => {
      const { error } = await supabase.from("contact_messages" as any).insert({
        name: input.name.trim(),
        email: input.email.trim(),
        subject: input.subject?.trim() || null,
        message: input.message.trim(),
        user_id: input.user_id ?? null,
      });
      if (error) throw error;
    },
  });
}

export interface ContactFilters {
  search?: string;
  status?: "" | "new" | "resolved";
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;
}

export function useContactMessages(filters: ContactFilters = {}) {
  const { search = "", status = "", fromDate, toDate } = filters;
  return useQuery({
    queryKey: ["contact-messages", { search, status, fromDate, toDate }],
    queryFn: async () => {
      let q = supabase.from("contact_messages" as any).select("*").order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      if (fromDate) q = q.gte("created_at", `${fromDate}T00:00:00`);
      if (toDate) q = q.lte("created_at", `${toDate}T23:59:59`);
      if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%,subject.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useResolveContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resolved }: { id: string; resolved: boolean }) => {
      const { data: userRes } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("contact_messages" as any)
        .update({
          status: resolved ? "resolved" : "new",
          resolved_at: resolved ? new Date().toISOString() : null,
          resolved_by: resolved ? userRes.user?.id ?? null : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}
