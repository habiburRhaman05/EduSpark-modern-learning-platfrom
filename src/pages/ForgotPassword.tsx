import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async () => {
    if (!email) { toast.error("Please enter your email"); return; }
    setSubmitting(true);
    const { error } = await resetPassword(email);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Reset link sent to your email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SB</span>
          </div>
          <span className="text-lg font-bold text-foreground">SkillBridge</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-black text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">We've sent a password reset link to <span className="text-foreground font-medium">{email}</span></p>
            <Link to="/login" className="text-primary font-semibold hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground mb-8">Enter your email and we'll send you a reset link</p>
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="pl-11 h-12 glass border-white/[0.08] rounded-xl" />
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 bg-primary hover:bg-primary/90 glow-primary rounded-xl mb-6">
              {submitting ? "Sending..." : "Send Reset Link"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
