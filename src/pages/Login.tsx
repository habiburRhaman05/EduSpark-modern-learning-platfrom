import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Sparkles, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AppLoader } from "@/components/AppLoader";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { signIn, user, role, loading } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || null;

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (user && !redirecting) {
    const dest = from || (
      role === "admin" ? "/admin" :
      role === "tutor" ? "/tutor" :
      role === "moderator" ? "/moderator" :
      role === "technician" ? "/technician" : "/dashboard"
    );
    return <Navigate to={dest} replace />;
  }

  const onSubmit = async (values: LoginForm) => {
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast.error(error.message || "Invalid credentials");
      return;
    }
    toast.success("Welcome back to EduSpark!");
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = from || "/dashboard";
    }, 800);
  };

  if (redirecting || (loading && user)) {
    return <AppLoader message="Signing you in..." />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />

      {/* ─── Left: Branded panel ─── */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06]" />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
            </div>
            <span className="text-lg font-black tracking-tight text-foreground">EduSpark</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary mb-5">
            <Star className="w-3 h-3 fill-current" /> Trusted by 50K+ learners
          </div>

          <h2 className="text-[42px] font-black text-foreground leading-[1.05] tracking-tight">
            Spark your<br />learning journey.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed text-[15px]">
            Get matched with verified expert tutors and master any subject through personalized 1-on-1 sessions.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { icon: ShieldCheck, text: "Verified expert tutors", color: "text-success" },
              { icon: Zap, text: "Book sessions in seconds", color: "text-warning" },
              { icon: Sparkles, text: "AI-matched to your goals", color: "text-primary" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm text-foreground font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 ring-2 ring-background"
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Join 50,000+ active learners</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-warning text-warning" /> 4.9 average rating · 180K sessions
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Right: Form ─── */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-black">EduSpark</span>
          </Link>

          <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-7 sm:p-9 shadow-2xl shadow-background/40">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to continue your learning journey.</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
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
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive mt-1.5">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30 mt-6 font-semibold transition-all hover:shadow-xl hover:shadow-primary/40"
              >
                {form.formState.isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-card/40 px-3 text-muted-foreground font-semibold">Or</span>
              </div>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              New to EduSpark?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create a free account
              </Link>
            </p>
          </div>

          <p className="text-[11px] text-center text-muted-foreground/70 mt-6 px-4">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link> and{" "}
            <Link to="/terms" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
