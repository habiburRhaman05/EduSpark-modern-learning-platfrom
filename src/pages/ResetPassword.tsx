import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    
    // Check URL hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSuccess(true);
    toast.success("Password updated successfully!");
    setTimeout(() => navigate("/login"), 2000);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid or expired reset link.</p>
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SB</span>
          </div>
          <span className="text-lg font-bold text-foreground">SkillBridge</span>
        </Link>

        {success ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-black text-foreground mb-2">Password Updated!</h1>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-foreground mb-2">Set New Password</h1>
            <p className="text-muted-foreground mb-8">Enter your new password below</p>
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type={showPw ? "text" : "password"} placeholder="New Password" className="pl-11 pr-11 h-12 glass border-white/[0.08] rounded-xl" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Confirm Password" className="pl-11 h-12 glass border-white/[0.08] rounded-xl" />
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 bg-primary hover:bg-primary/90 glow-primary rounded-xl">
              {submitting ? "Updating..." : "Update Password"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
