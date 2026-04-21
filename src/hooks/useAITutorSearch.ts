import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AISuggestion {
  id: string;
  score: number;
  reason: string;
}

export function useAITutorSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AISuggestion[] | null>(null);
  const [summary, setSummary] = useState<string>("");

  const run = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("ai-tutor-search", {
        body: { query },
      });

      if (fnErr) {
        // Try to extract a useful message from the FunctionsHttpError context
        let msg = fnErr.message || "AI search failed";
        const ctx = (fnErr as any).context;
        if (ctx) {
          try {
            const j = await ctx.json?.();
            if (j?.error) msg = j.error;
          } catch {
            try {
              const t = await ctx.text?.();
              if (t) msg = t.length > 200 ? t.slice(0, 200) + "…" : t;
            } catch { /* noop */ }
          }
        }
        // Network failures (CORS, offline) often surface as "Failed to send a request" — provide actionable hint
        if (/failed to send a request|failed to fetch|network/i.test(msg)) {
          msg = "Couldn't reach the AI service. Please check your connection and retry.";
        }
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);

      setResults(data?.results ?? []);
      setSummary(data?.summary ?? "");
      return data;
    } catch (e: any) {
      const msg = e?.message || "AI search failed";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setSummary("");
    setError(null);
  };

  return { loading, error, results, summary, run, reset };
}
