import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Loader2, Send, Star, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useAITutorSearch } from "@/hooks/useAITutorSearch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { VerifiedAvatar } from "@/components/VerifiedAvatar";
import { toast } from "sonner";

const SAMPLE_QUERIES = [
  "Help me prep for IELTS speaking",
  "I'm stuck on calculus integrals",
  "Build my first React app",
  "Improve my essay writing",
];

export function AITutorSearch() {
  const [query, setQuery] = useState("");
  const { loading, results, summary, error, run, reset } = useAITutorSearch();

  // Hydrate the ranked tutor IDs into full tutor cards
  const ids = results?.map((r) => r.id) ?? [];
  const { data: tutors } = useQuery({
    enabled: ids.length > 0,
    queryKey: ["ai-tutors-hydrate", ids],
    queryFn: async () => {
      const { data: tp, error } = await supabase
        .from("tutor_profiles")
        .select("id, user_id, headline, hourly_rate, avg_rating, total_reviews, category, is_verified")
        .in("id", ids);
      if (error) throw error;
      const userIds = (tp || []).map((t) => t.user_id).filter(Boolean);
      const { data: ps } = await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", userIds);
      const pmap = new Map((ps || []).map((p: any) => [p.user_id, p]));
      return (tp || []).map((t) => ({ ...t, profile: pmap.get(t.user_id) }));
    },
  });

  const tutorMap = new Map((tutors || []).map((t) => [t.id, t]));
  const ordered = (results || []).map((r) => ({ ...r, t: tutorMap.get(r.id) })).filter((x) => x.t);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length < 3) {
      toast.error("Tell us a bit more — at least 3 characters");
      return;
    }
    try {
      await run(query.trim());
    } catch (e: any) {
      toast.error(e.message || "AI search failed");
    }
  };

  return (
    <div className="bento-card mb-6 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Tutor Match</h3>
            <p className="text-[11px] text-muted-foreground">Describe what you want to learn — we'll suggest the best tutors.</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex gap-2">
          <div className="relative flex-1">
            <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I want to pass IELTS speaking band 7…"
              maxLength={200}
              className="pl-10 h-11 rounded-xl"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-primary to-accent">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="ml-1.5 hidden sm:inline">{loading ? "Thinking…" : "Match"}</span>
          </Button>
          {(results || error) && (
            <Button type="button" variant="ghost" size="icon" onClick={() => { reset(); setQuery(""); }} className="rounded-xl">
              <X className="w-4 h-4" />
            </Button>
          )}
        </form>

        {!results && !loading && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => { setQuery(q); }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs text-destructive">{error}</p>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </motion.div>
          )}

          {!loading && results && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              {summary && (
                <div className="text-xs text-muted-foreground mb-3 italic">
                  <span className="text-primary font-semibold not-italic">AI:</span> {summary}
                </div>
              )}
              {ordered.length === 0 ? (
                <p className="text-sm text-muted-foreground">No good matches — try a different phrasing.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {ordered.map(({ t, reason, score }: any) => (
                    <Link
                      key={t.id}
                      to={`/tutors/${t.id}`}
                      className="flex gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                    >
                      <VerifiedAvatar src={t.profile?.avatar_url} name={t.profile?.full_name || "Tutor"} size="sm" isVerified={t.is_verified} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {t.profile?.full_name || "Tutor"}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                            {score}% fit
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{reason}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="flex items-center gap-0.5 text-foreground">
                            <Star className="w-3 h-3 fill-warning text-warning" /> {Number(t.avg_rating ?? 0).toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">·  ${t.hourly_rate}/hr</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
