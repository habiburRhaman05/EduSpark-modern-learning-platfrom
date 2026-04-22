// Creates a Daily.co room for a confirmed booking and saves URL on bookings row.
// Redeploy marker: 2026-04-22T01:30Z
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
      console.error("create-meeting-room auth error:", userError?.message || "missing user");
      return json({ error: "Unauthorized" }, 401);
    }

    // Use service role to bypass RLS for trusted update after auth check
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking, error: bErr } = await admin
      .from("bookings")
      .select("id, student_id, tutor_id, scheduled_at, duration_minutes, meeting_room_url, meeting_room_name")
      .eq("id", bookingId)
      .single();
    if (bErr || !booking) throw new Error("Booking not found");

    if (booking.student_id !== userId && booking.tutor_id !== userId) {
      return json({ error: "Forbidden" }, 403);
    }

    // Already created — return existing
    if (booking.meeting_room_url) {
      return json({ url: booking.meeting_room_url, name: booking.meeting_room_name });
    }

    const now = Date.now();
    const start = new Date(booking.scheduled_at).getTime();
    const end = start + (booking.duration_minutes || 60) * 60 * 1000;
    // Clamp expiry to at least now + 90 min so backdated test bookings don't 400
    const expSec = Math.max(Math.floor(end / 1000) + 30 * 60, Math.floor(now / 1000) + 90 * 60);

    const roomName = `eduspark-${bookingId.slice(0, 8)}-${Date.now().toString(36)}`;

    const dailyRes = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          exp: expSec,
          enable_chat: true,
          enable_screenshare: true,
          enable_prejoin_ui: false,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 2,
        },
      }),
    });
    const dailyData = await dailyRes.json();
    if (!dailyRes.ok) throw new Error(`Daily API error: ${JSON.stringify(dailyData)}`);

    await admin.from("bookings").update({
      meeting_room_url: dailyData.url,
      meeting_room_name: dailyData.name,
      meeting_link: dailyData.url, // keep legacy column populated
      call_status: "not_started",
    }).eq("id", bookingId);

    return json({ url: dailyData.url, name: dailyData.name });
  } catch (e) {
    console.error("create-meeting-room error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
