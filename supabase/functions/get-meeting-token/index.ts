// Issues short-lived Daily meeting token after verifying time window + access.
// Redeploy marker: 2026-04-22T01:30Z
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

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
    const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
    if (!DAILY_API_KEY) throw new Error("DAILY_API_KEY missing");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const accessToken = authHeader.replace("Bearer ", "");

    let body: { bookingId?: string } | null = null;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid request body" }, 400);
    }

    const bookingId = body?.bookingId?.trim();
    if (!bookingId) return json({ error: "bookingId required" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    const userId = userData.user?.id;
    if (userError || !userId) {
      console.error("get-meeting-token auth error:", userError?.message || "missing user");
      return json({ error: "Unauthorized" }, 401);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking } = await admin
      .from("bookings")
      .select("id, student_id, tutor_id, scheduled_at, duration_minutes, meeting_room_name, meeting_room_url, status, call_started_at")
      .eq("id", bookingId)
      .single();
    if (!booking) throw new Error("Booking not found");

    const isStudent = booking.student_id === userId;
    const isTutor = booking.tutor_id === userId;
    if (!isStudent && !isTutor) {
      return json({ error: "Forbidden" }, 403);
    }

    if (booking.status === "cancelled") {
      return json({ error: "Session cancelled", reason: "cancelled" }, 403);
    }

    if (booking.status === "pending") {
      return json({
        error: "This session is awaiting payment confirmation.",
        reason: "awaiting_payment",
      }, 403);
    }

    const now = Date.now();
    const start = new Date(booking.scheduled_at).getTime();
    const end = start + (booking.duration_minutes || 60) * 60 * 1000;
    const earliestJoin = start - JOIN_BEFORE_MS;
    // Clamp latestJoin so backdated test bookings still allow joining for at least 30 min from now
    const latestJoin = Math.max(end + JOIN_AFTER_END_MS, now + 30 * 60 * 1000);

    if (now < earliestJoin) {
      return json({
        error: "Too early to join",
        reason: "too_early",
        startsAt: booking.scheduled_at,
        joinAt: new Date(earliestJoin).toISOString(),
      }, 403);
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

    // Always set call_status='in_progress' for everyone joining
    await admin.from("bookings")
      .update({ call_status: "in_progress" })
      .eq("id", bookingId);

    // Stamp call_started_at only on first join
    if (!booking.call_started_at) {
      await admin.from("bookings")
        .update({ call_started_at: new Date().toISOString() })
        .eq("id", bookingId)
        .is("call_started_at", null);
    }

    // Audit join (best-effort)
    try {
      await admin.from("call_participants").insert({
        booking_id: bookingId,
        user_id: userId,
        role: isTutor ? "tutor" : "student",
      });
    } catch (_) { /* noop */ }

    return json({
      token: tokenData.token,
      url: booking.meeting_room_url,
      role: isTutor ? "tutor" : "student",
    });
  } catch (e) {
    console.error("get-meeting-token error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
