import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.4 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-primary via-accent to-primary pointer-events-none"
    />
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.button
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, y: visible ? 0 : 20 }}
      transition={{ duration: 0.25 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-card border border-border/60 shadow-xl shadow-primary/10 hover:shadow-primary/30 hover:border-primary/40 backdrop-blur-xl flex items-center justify-center text-foreground hover:scale-110 transition-all group"
      aria-label="Scroll to top"
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="21" fill="none" stroke="hsl(var(--border))" strokeWidth="2" opacity="0.3" />
        <motion.circle
          cx="24" cy="24" r="21" fill="none"
          stroke="url(#stp-grad)" strokeWidth="2.5" strokeLinecap="round"
          style={{ pathLength }}
        />
        <defs>
          <linearGradient id="stp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp className="relative w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
    </motion.button>
  );
}
