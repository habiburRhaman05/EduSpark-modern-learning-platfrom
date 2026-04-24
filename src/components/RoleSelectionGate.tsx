import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PENDING_ROLE_KEY = "pending_signup_role";

type ChosenRole = "student" | "tutor";

/**
 * Forces a user (e.g. arriving from Google OAuth signup) to pick a role
 * before they can use the app. The dialog cannot be dismissed.
 *
 * Show condition:
 *   - User is logged in
 *   - AuthContext finished loading
 *   - There is a `pending_signup_role` in localStorage (set right before OAuth redirect)
 *     OR the user is brand new (account < 5 minutes old) AND role is still the default 'student'
 */
export function RoleSelectionGate() {
  const { user, role, loading, refreshProfile, session } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<ChosenRole | null>(null);
  const [picked, setPicked] = useState<ChosenRole | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading || !user) { setOpen(false); return; }

    const pending = (typeof window !== "undefined"
      ? (localStorage.getItem(PENDING_ROLE_KEY) as ChosenRole | null)
      : null);

    // Brand new account heuristic: account created in the last 10 minutes.
    const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0;
    const isFresh = createdAt > 0 && Date.now() - createdAt < 10 * 60 * 1000;

    // Only show when a role choice is genuinely pending.
    // If pending key exists, always show (user explicitly came from "Continue with Google" on register).
    // Otherwise, show only when account is fresh AND role is still default 'student'
    // AND the user has no student preferences yet (i.e., truly hasn't onboarded).
    const shouldShow = !!pending || (isFresh && role === "student");
    setOpen(shouldShow);

    // If their role already matches a pending choice, clear the pending flag.
    if (pending && role === pending) {
      localStorage.removeItem(PENDING_ROLE_KEY);
      setOpen(false);
      // Route them onward
      routeAfterRole(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, role]);

  function routeAfterRole(r: ChosenRole) {
    if (r === "tutor") navigate("/tutor", { replace: true });
    else navigate("/student-preferences", { replace: true });
  }

  async function choose(r: ChosenRole) {
    if (submitting) return;
    setSubmitting(r);
    setPicked(r);
    try {
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error("No session");

      const { data, error } = await supabase.functions.invoke("set-initial-role", {
        body: { role: r },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      localStorage.removeItem(PENDING_ROLE_KEY);
      await refreshProfile();
      toast.success(r === "tutor" ? "Welcome, tutor! Let's set up your profile." : "Welcome! Let's personalize your learning.");
      setOpen(false);
      routeAfterRole(r);
    } catch (e: any) {
      toast.error(e?.message || "Could not set role. Please try again.");
      setSubmitting(null);
      setPicked(null);
    }
  }

  if (!open) return null;

  return (
    <Dialog open={open}>
      <DialogContent
        // Make the dialog impossible to dismiss until a role is chosen.
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-lg [&>button]:hidden"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-black tracking-tight">
            One last step — choose your role
          </DialogTitle>
        </div>
        <DialogDescription>
          This determines your dashboard and what you can do on EduSpark. You can't change this later from here, so pick carefully.
        </DialogDescription>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {([
            {
              value: "student" as const,
              label: "I'm a Student",
              desc: "Learn from verified expert tutors in 1-on-1 sessions.",
              Icon: GraduationCap,
            },
            {
              value: "tutor" as const,
              label: "I'm a Tutor",
              desc: "Teach students, manage bookings, and earn online.",
              Icon: Briefcase,
            },
          ]).map((r) => {
            const active = picked === r.value;
            const isLoading = submitting === r.value;
            const disabled = !!submitting && !isLoading;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => choose(r.value)}
                disabled={disabled || isLoading}
                className={`relative p-4 rounded-2xl text-left transition-all border-2 group ${
                  active
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                    : "bg-background/40 border-border/60 hover:border-primary/40"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {active && !isLoading && (
                  <CheckCircle2 className="absolute top-2.5 right-2.5 w-4 h-4 text-primary" />
                )}
                {isLoading && (
                  <Loader2 className="absolute top-2.5 right-2.5 w-4 h-4 text-primary animate-spin" />
                )}
                <r.Icon className={`w-6 h-6 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-bold text-sm text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground mt-2">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Sign-out escape valve so user is never fully trapped */}
        <div className="flex justify-end mt-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!!submitting}
            onClick={async () => {
              localStorage.removeItem(PENDING_ROLE_KEY);
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const PENDING_SIGNUP_ROLE_KEY = PENDING_ROLE_KEY;
