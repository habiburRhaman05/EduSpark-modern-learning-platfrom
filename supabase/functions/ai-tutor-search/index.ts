// AI-powered tutor search — returns ranked tutor IDs with reasoning
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-supabase-api-version",
  "Access-Control-Max-Age": "86400",
};
// v2 — CORS allowlist refresh to force redeploy

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Health check for diagnostics
  const url = new URL(req.url);
  if (req.method === "GET" || url.searchParams.get("health") === "1") {
    return new Response(JSON.stringify({ ok: true, service: "ai-tutor-search", v: 3 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { query } = body || {};
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Query must be at least 3 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Pull a candidate set (cap at 60 to keep prompt small)
    const { data: tutorRows, error: tErr } = await supabase
      .from("tutor_profiles")
      .select("id, user_id, headline, bio, subjects, hourly_rate, avg_rating, total_reviews, category, is_verified")
      .order("avg_rating", { ascending: false })
      .limit(60);
    if (tErr) throw tErr;

    if (!tutorRows || tutorRows.length === 0) {
      return new Response(JSON.stringify({ results: [], summary: "No tutors available yet." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userIds = tutorRows.map((t: any) => t.user_id).filter(Boolean);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .in("user_id", userIds);
    const pmap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
    // v3 — fixed profiles join (user_id), added health endpoint above

    const candidates = tutorRows.map((t: any) => {
      const p = pmap.get(t.user_id);
      return {
        id: t.id,
        name: p?.full_name || "Tutor",
        headline: t.headline || "",
        category: t.category || "",
        subjects: (t.subjects || []).slice(0, 8),
        rating: Number(t.avg_rating) || 0,
        reviews: t.total_reviews || 0,
        rate: Number(t.hourly_rate) || 0,
        verified: !!t.is_verified,
      };
    });

    const systemPrompt = `You are EduSpark's tutor matching assistant. Given a learner's query and a JSON list of tutors, pick the 3-6 best fits. Use semantic understanding — e.g. "help me prep for IELTS speaking" → English/Test Prep tutors; "I'm building my first React app" → web dev tutors.
Rules:
- Prefer verified tutors and higher ratings on close matches.
- Always return between 3 and 6 results unless fewer candidates exist.
- Keep "reason" concise (max 18 words), action-oriented, no fluff.
- Ignore tutors that clearly don't match the subject area.`;

    const userPrompt = `Learner query: "${query.trim()}"\n\nCandidates:\n${JSON.stringify(candidates)}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "rank_tutors",
              description: "Return ranked best-fit tutors for the learner query.",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "One short sentence describing what the learner needs." },
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        score: { type: "number", description: "0-100 fit score" },
                        reason: { type: "string" },
                      },
                      required: ["id", "score", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["summary", "results"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "rank_tutors" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "AI is busy. Please retry in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Top up Lovable AI usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments ? JSON.parse(toolCall.function.arguments) : null;

    if (!args?.results) {
      return new Response(JSON.stringify({ results: [], summary: "Couldn't generate suggestions." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        summary: args.summary,
        results: args.results.slice(0, 6),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-tutor-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
