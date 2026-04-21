// Creates a Daily.co room for a confirmed booking and saves URL on bookings row.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub;

    const { bookingId } = await req.json();
    if (!bookingId) throw new Error("bookingId required");

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
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Already created — return existing
    if (booking.meeting_room_url) {
      return new Response(JSON.stringify({ url: booking.meeting_room_url, name: booking.meeting_room_name }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const start = new Date(booking.scheduled_at).getTime();
    const end = start + (booking.duration_minutes || 60) * 60 * 1000;
    const expSec = Math.floor(end / 1000) + 30 * 60; // expire 30 min after end

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

    return new Response(JSON.stringify({ url: dailyData.url, name: dailyData.name }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-meeting-room error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
