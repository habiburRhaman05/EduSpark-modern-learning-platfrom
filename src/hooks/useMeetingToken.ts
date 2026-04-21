import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MeetingTokenResult {
  token: string;
  url: string;
  role: "tutor" | "student";
}

export interface MeetingTokenError {
  error: string;
  reason?: "too_early" | "expired" | "cancelled";
  startsAt?: string;
  joinAt?: string;
}

export function useGetMeetingToken() {
  return useMutation<MeetingTokenResult, MeetingTokenError, string>({
    mutationFn: async (bookingId: string) => {
      try {
        const { data, error } = await supabase.functions.invoke("get-meeting-token", {
          body: { bookingId },
        });
        if (error) {
          const ctx = (error as any).context;
          let body: any = null;
          try { body = await ctx?.json?.(); } catch { /* noop */ }
          throw (body || { error: error.message || "Failed to reach meeting service" }) as MeetingTokenError;
        }
        if (!data?.token) throw { error: data?.error || "No token returned", reason: data?.reason } as MeetingTokenError;
        return data as MeetingTokenResult;
      } catch (e: any) {
        if (e && typeof e === "object" && "error" in e) throw e;
        throw { error: e?.message || "Network error contacting meeting service" } as MeetingTokenError;
      }
    },
  });
}

export function useCreateMeetingRoom() {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase.functions.invoke("create-meeting-room", {
        body: { bookingId },
      });
      if (error) {
        const ctx = (error as any).context;
        let body: any = null;
        try { body = await ctx?.json?.(); } catch { /* noop */ }
        throw new Error(body?.error || error.message || "Failed to create meeting room");
      }
      return data as { url: string; name: string };
    },
  });
}


export function useEndMeeting() {
  return useMutation({
    mutationFn: async (vars: { bookingId: string; durationSec?: number }) => {
      const { data, error } = await supabase.functions.invoke("end-meeting", {
        body: vars,
      });
      if (error) throw error;
      return data;
    },
  });
}
