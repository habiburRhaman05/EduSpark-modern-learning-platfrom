import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, Sparkles, GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";

async function signUpWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/dashboard` },
  });
  if (error) toast.error(error.message);
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"/>
    </svg>
  );
}

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});
type SignupForm = z.infer<typeof signupSchema>;
type SignupRole = "student" | "tutor";

export default function Register() {
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SignupRole>("student");
  const { signUp, user } = useAuth();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values: SignupForm) => {
    const { error } = await signUp(values.email, values.password, values.name, selectedRole);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome to EduSpark! Please check your email to verify.");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.05fr] bg-background relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />

      {/* ─── Left: Form ─── */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
         

          <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-7 sm:p-9 shadow-2xl shadow-background/40">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Create your account</h1>
            <p className="text-muted-foreground mt-2 text-sm">Start your learning journey in under 60 seconds.</p>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2.5 mt-6">
              {([
                { value: "student" as const, label: "Student", desc: "Learn from experts", Icon: GraduationCap },
                { value: "tutor" as const, label: "Tutor", desc: "Teach & earn", Icon: Briefcase },
              ]).map((r) => {
                const active = selectedRole === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`relative p-3.5 rounded-2xl text-left transition-all border-2 group ${
                      active
                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                        : "bg-background/40 border-border/60 hover:border-primary/40"
                    }`}
                  >
                    {active && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
                    )}
                    <r.Icon className={`w-5 h-5 mb-1.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`font-bold text-sm ${active ? "text-foreground" : "text-foreground"}`}>{r.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{r.desc}</p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs font-semibold text-foreground mb-1.5 block">Full name</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    {...form.register("name")}
                    className="pl-10 h-12 rounded-xl border-border/80 bg-background/60 focus-visible:ring-primary/30 focus-visible:border-primary"
                  />
                </div>
                {form.formState.errors.name && <p className="text-xs text-destructive mt-1.5">{form.formState.errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-semibold text-foreground mb-1.5 block">Email address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...form.register("email")}
                    className="pl-10 h-12 rounded-xl border-border/80 bg-background/60 focus-visible:ring-primary/30 focus-visible:border-primary"
                  />
                </div>
                {form.formState.errors.email && <p className="text-xs text-destructive mt-1.5">{form.formState.errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-xs font-semibold text-foreground mb-1.5 block">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    {...form.register("password")}
                    className="pl-10 pr-10 h-12 rounded-xl border-border/80 bg-background/60 focus-visible:ring-primary/30 focus-visible:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.formState.errors.password && <p className="text-xs text-destructive mt-1.5">{form.formState.errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30 mt-6 font-semibold"
              >
                {form.formState.isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-card/40 px-3 text-muted-foreground font-semibold">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={signUpWithGoogle}
              className="w-full h-12 rounded-xl font-semibold gap-2"
            >
              <GoogleIcon /> Continue with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-7">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
            </p>
          </div>

          <p className="text-[11px] text-center text-muted-foreground/70 mt-6 px-4">
            By creating an account you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
            <Link to="/terms" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>

      {/* ─── Right: Branded panel ─── */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden p-12 order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/[0.08] via-transparent to-accent/[0.06]" />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md"
        >
                  <Logo size="lg" className="my-5"/>


          <h2 className="text-[42px] font-black text-foreground leading-[1.05] tracking-tight">
            Join the<br />learning revolution.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed text-[15px]">
            Whether you want to master a new skill or share your expertise with others — EduSpark is built for you.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { value: "2.5K+", label: "Expert Tutors" },
              { value: "200+", label: "Subjects" },
              { value: "4.9★", label: "Avg Rating" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="rounded-2xl bg-card/50 border border-border/60 backdrop-blur-sm p-4"
              >
                <p className="text-2xl font-black text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 space-y-2.5">
            {[
              "Free to sign up — no credit card required",
              "Browse 2,500+ verified expert tutors",
              "Cancel or reschedule sessions anytime",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-foreground">{t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
