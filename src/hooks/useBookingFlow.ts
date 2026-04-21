import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BookingInput {
  tutorUserId: string;
  tutorProfileId?: string; // optional — used to mark availability slot booked
  subject: string;
  scheduledAt: string; // ISO
  durationMinutes: number;
  amount: number;
  notes?: string;
  cardLast4?: string;
}

/** Check tutor availability + conflicts for a given time. */
export function useCheckBookingConflict(
  tutorUserId: string | undefined,
  scheduledAt: string | undefined,
  durationMinutes: number,
  tutorProfileId?: string,
) {
  return useQuery({
    queryKey: ["booking-conflict", tutorUserId, scheduledAt, durationMinutes, tutorProfileId],
    enabled: !!tutorUserId && !!scheduledAt,
    queryFn: async () => {
      const start = new Date(scheduledAt!);
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
      const winStart = new Date(start.getTime() - 4 * 60 * 60 * 1000).toISOString();
      const winEnd = new Date(end.getTime() + 4 * 60 * 60 * 1000).toISOString();

      // 1. existing booking conflict
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, scheduled_at, duration_minutes, status")
        .eq("tutor_id", tutorUserId!)
        .neq("status", "cancelled")
        .gte("scheduled_at", winStart)
        .lte("scheduled_at", winEnd);
      if (error) throw error;

      const bookingConflict = (bookings || []).some((b: any) => {
        const bs = new Date(b.scheduled_at).getTime();
        const be = bs + (b.duration_minutes || 60) * 60 * 1000;
        return bs < end.getTime() && be > start.getTime();
      });

      // 2. availability slot check (only if profile id known)
      let withinAvailability = true;
      if (tutorProfileId) {
        const dow = start.getUTCDay() === 0 ? 0 : start.getDay(); // local day of week
        const { data: slots } = await supabase
          .from("availability")
          .select("day_of_week, start_time, end_time, is_recurring, specific_date, is_booked")
          .eq("tutor_id", tutorProfileId);
        if (slots && slots.length > 0) {
          const sHM = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
          const eHM = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
          const dateStr = start.toISOString().slice(0, 10);
          withinAvailability = slots.some((s: any) => {
            const dayMatches = s.is_recurring
              ? s.day_of_week === dow
              : s.specific_date === dateStr;
            if (!dayMatches) return false;
            // time within [start_time, end_time]
            return sHM >= s.start_time.slice(0, 5) && eHM <= s.end_time.slice(0, 5);
          });
        }
      }

      return {
        conflict: bookingConflict || !withinAvailability,
        bookingConflict,
        outsideAvailability: !withinAvailability,
      };
    },
  });
}

export function useCreateBookingWithPayment() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BookingInput) => {
      if (!user) throw new Error("Please sign in to book");

      const start = new Date(input.scheduledAt);
      const end = new Date(start.getTime() + input.durationMinutes * 60 * 1000);
      const winStart = new Date(start.getTime() - 4 * 60 * 60 * 1000).toISOString();
      const winEnd = new Date(end.getTime() + 4 * 60 * 60 * 1000).toISOString();

      // Final conflict check
      const { data: existing } = await supabase
        .from("bookings")
        .select("id, scheduled_at, duration_minutes")
        .eq("tutor_id", input.tutorUserId)
        .neq("status", "cancelled")
        .gte("scheduled_at", winStart)
        .lte("scheduled_at", winEnd);

      const conflict = (existing || []).some((b: any) => {
        const bs = new Date(b.scheduled_at).getTime();
        const be = bs + (b.duration_minutes || 60) * 60 * 1000;
        return bs < end.getTime() && be > start.getTime();
      });
      if (conflict) throw new Error("This time slot is already booked. Please pick another time.");

      // Create booking
      const { data: booking, error: bErr } = await supabase
        .from("bookings")
        .insert({
          student_id: user.id,
          tutor_id: input.tutorUserId,
          subject: input.subject,
          scheduled_at: input.scheduledAt,
          duration_minutes: input.durationMinutes,
          amount: input.amount,
          status: "confirmed",
          payment_status: "paid",
          notes: input.notes || null,
        })
        .select()
        .single();
      if (bErr) throw bErr;

      // Payment row
      const { error: pErr } = await supabase.from("payments").insert({
        booking_id: booking.id,
        payer_id: user.id,
        payee_id: input.tutorUserId,
        amount: input.amount,
        platform_fee: input.amount * 0.1,
        net_amount: input.amount * 0.9,
        status: "completed",
        method: "card",
        transaction_ref: `DEMO-${Date.now()}-${input.cardLast4 || "0000"}`,
      });
      if (pErr) console.error("Payment insert failed", pErr);

      // Mark a matching availability slot as booked (best effort)
      if (input.tutorProfileId) {
        try {
          const dow = start.getDay();
          const sHM = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
          const eHM = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
          const dateStr = start.toISOString().slice(0, 10);
          const { data: slots } = await supabase
            .from("availability")
            .select("id, day_of_week, start_time, end_time, is_recurring, specific_date")
            .eq("tutor_id", input.tutorProfileId)
            .eq("is_booked", false);
          const match = (slots || []).find((s: any) => {
            const dayMatches = s.is_recurring ? s.day_of_week === dow : s.specific_date === dateStr;
            return dayMatches && sHM >= s.start_time.slice(0, 5) && eHM <= s.end_time.slice(0, 5);
          });
          if (match) {
            await supabase.from("availability").update({ is_booked: true }).eq("id", match.id);
          }
        } catch (e) {
          console.warn("Availability slot update skipped", e);
        }
      }

      // Create Daily.co meeting room (best-effort, non-blocking)
      try {
        await supabase.functions.invoke("create-meeting-room", { body: { bookingId: booking.id } });
      } catch (e) {
        console.warn("Meeting room creation failed (will retry on join)", e);
      }

      return booking;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-bookings"] });
      qc.invalidateQueries({ queryKey: ["booking-conflict"] });
      qc.invalidateQueries({ queryKey: ["tutor-availability"] });
    },
  });
}
