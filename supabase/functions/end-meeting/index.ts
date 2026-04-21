// Records call end + auto-completes booking + credits tutor when applicable.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub;

    const { bookingId, durationSec } = await req.json();
    if (!bookingId) throw new Error("bookingId required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking } = await admin
      .from("bookings")
      .select("id, student_id, tutor_id, duration_minutes, status, call_started_at")
      .eq("id", bookingId)
      .single();
    if (!booking) throw new Error("Booking not found");

    const isTutor = booking.tutor_id === userId;
    const isStudent = booking.student_id === userId;
    if (!isStudent && !isTutor) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const startedAt = booking.call_started_at ? new Date(booking.call_started_at) : now;
    const totalSec = durationSec ?? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000));

    // Close participant row
    const { data: openRow } = await admin
      .from("call_participants")
      .select("id, joined_at")
      .eq("booking_id", bookingId)
      .eq("user_id", userId)
      .is("left_at", null)
      .order("joined_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (openRow) {
      const joinedAt = new Date(openRow.joined_at).getTime();
      await admin.from("call_participants").update({
        left_at: now.toISOString(),
        duration_sec: Math.max(0, Math.floor((now.getTime() - joinedAt) / 1000)),
      }).eq("id", openRow.id);
    }

    const update: Record<string, unknown> = {
      call_ended_at: now.toISOString(),
      call_duration_sec: totalSec,
      call_status: "ended",
    };

    // Auto-complete if duration is at least 50% of scheduled
    const scheduledSec = (booking.duration_minutes || 60) * 60;
    const shouldComplete = isTutor && totalSec >= scheduledSec * 0.5 && booking.status !== "completed";
    if (shouldComplete) {
      update.status = "completed";
    }

    await admin.from("bookings").update(update).eq("id", bookingId);

    if (shouldComplete) {
      // Best-effort tutor credit; ignore error if RPC absent
      await admin.rpc("credit_tutor_for_booking" as never, { p_booking_id: bookingId } as never).catch(() => null);
    }

    return new Response(JSON.stringify({ ok: true, durationSec: totalSec, completed: shouldComplete }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("end-meeting error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
