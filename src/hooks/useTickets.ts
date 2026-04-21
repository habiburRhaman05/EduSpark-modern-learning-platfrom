import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TicketInput {
  subject: string;
  category?: string;
  priority?: string;
  message: string;
}

export function useMyTickets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-tickets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("support_tickets").select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAllTickets(opts: { status?: string; search?: string } = {}) {
  const { status = "", search = "" } = opts;
  return useQuery({
    queryKey: ["all-tickets", { status, search }],
    queryFn: async () => {
      let q = (supabase as any).from("support_tickets").select("*").order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      if (search) q = q.ilike("subject", `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      const userIds = Array.from(new Set<string>((data || []).map((t: any) => t.user_id as string)));
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("user_id, full_name, email, avatar_url").in("user_id", userIds)
        : { data: [] as any };
      const m = new Map<string, any>();
      (profs || []).forEach((p: any) => m.set(p.user_id, p));
      return (data || []).map((t: any) => ({ ...t, user: m.get(t.user_id) }));
    },
  });
}

export function useTicketMessages(ticketId?: string) {
  return useQuery({
    queryKey: ["ticket-messages", ticketId],
    enabled: !!ticketId,
    refetchInterval: 5000,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("ticket_messages").select("*")
        .eq("ticket_id", ticketId).order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateTicket() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TicketInput) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await (supabase as any).from("support_tickets")
        .insert({
          user_id: user.id,
          subject: input.subject,
          category: input.category || "general",
          priority: input.priority || "medium",
          status: "open",
        }).select().single();
      if (error) throw error;
      const { error: msgErr } = await (supabase as any).from("ticket_messages").insert({
        ticket_id: data.id, sender_id: user.id, content: input.message, is_staff: false,
      });
      if (msgErr) throw msgErr;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-tickets"] }),
  });
}

export function useReplyTicket() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, content, isStaff }: { ticketId: string; content: string; isStaff: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await (supabase as any).from("ticket_messages").insert({
        ticket_id: ticketId, sender_id: user.id, content, is_staff: isStaff,
      });
      if (error) throw error;
      await (supabase as any).from("support_tickets").update({ updated_at: new Date().toISOString() }).eq("id", ticketId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket-messages"] });
      qc.invalidateQueries({ queryKey: ["all-tickets"] });
    },
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase as any).from("support_tickets").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-tickets"] });
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
    },
  });
}
