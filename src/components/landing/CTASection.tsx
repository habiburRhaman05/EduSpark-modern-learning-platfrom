import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden border border-border/60 bg-gradient-to-br from-primary via-primary/90 to-accent shadow-2xl shadow-primary/20"
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-accent/40 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, -5, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl"
          />

          <div className="relative px-6 py-14 sm:px-12 sm:py-16 lg:px-20 lg:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur text-primary-foreground/90 text-[11px] font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3 h-3" /> Start today
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary-foreground mb-4 max-w-2xl mx-auto">
              Your next breakthrough is one session away.
            </h2>
            <p className="text-primary-foreground/85 max-w-xl mx-auto mb-8 text-base sm:text-lg">
              Join 50,000+ learners using EduSpark to master subjects faster. First session, on us.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <div className="relative w-full sm:flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
                <Input
                  placeholder="Enter your email"
                  className="pl-11 h-12 rounded-xl bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground/40 backdrop-blur"
                />
              </div>
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-12 px-6 rounded-xl bg-background text-foreground hover:bg-background/90 font-semibold shadow-lg">
                  Get started <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            <p className="text-xs text-primary-foreground/70 mt-5">No credit card required · Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
