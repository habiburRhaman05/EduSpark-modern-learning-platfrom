// Issues short-lived Daily meeting token after verifying time window + access.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const JOIN_BEFORE_MS = 15 * 60 * 1000;
const JOIN_AFTER_END_MS = 15 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
    if (!DAILY_API_KEY) throw new Error("DAILY_API_KEY missing");

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

    const { bookingId } = await req.json();
    if (!bookingId) throw new Error("bookingId required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking } = await admin
      .from("bookings")
      .select("id, student_id, tutor_id, scheduled_at, duration_minutes, meeting_room_name, meeting_room_url, status")
      .eq("id", bookingId)
      .single();
    if (!booking) throw new Error("Booking not found");

    const isStudent = booking.student_id === userId;
    const isTutor = booking.tutor_id === userId;
    if (!isStudent && !isTutor) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (booking.status === "cancelled") {
      return new Response(JSON.stringify({ error: "Session cancelled", reason: "cancelled" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const start = new Date(booking.scheduled_at).getTime();
    const end = start + (booking.duration_minutes || 60) * 60 * 1000;
    const earliestJoin = start - JOIN_BEFORE_MS;
    const latestJoin = end + JOIN_AFTER_END_MS;

    if (now < earliestJoin) {
      return new Response(JSON.stringify({
        error: "Too early to join",
        reason: "too_early",
        startsAt: booking.scheduled_at,
        joinAt: new Date(earliestJoin).toISOString(),
      }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (now > latestJoin) {
      return new Response(JSON.stringify({ error: "Session expired", reason: "expired" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!booking.meeting_room_name) throw new Error("Meeting room not yet provisioned");

    // Get user display name
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();

    const tokenExp = Math.floor(latestJoin / 1000);

    const tokenRes = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: booking.meeting_room_name,
          user_name: profile?.full_name || (isTutor ? "Tutor" : "Student"),
          user_id: userId,
          is_owner: isTutor,
          exp: tokenExp,
          start_video_off: false,
          start_audio_off: false,
        },
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(`Daily token error: ${JSON.stringify(tokenData)}`);

    // Mark in_progress and stamp first start
    await admin.from("bookings").update({
      call_status: "in_progress",
      call_started_at: booking["call_started_at" as never] ?? new Date().toISOString(),
    }).eq("id", bookingId).is("call_started_at", null);

    // Audit join
    await admin.from("call_participants").insert({
      booking_id: bookingId,
      user_id: userId,
      role: isTutor ? "tutor" : "student",
    });

    return new Response(JSON.stringify({
      token: tokenData.token,
      url: booking.meeting_room_url,
      role: isTutor ? "tutor" : "student",
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("get-meeting-token error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
