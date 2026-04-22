import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AppLoader({ message = "Loading your dashboard..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="relative">
           <img  className="w-[100px]" src="/public/main-logo.png" alt="" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
        
        </div>
        <div className="text-center">
          <p className="text-base font-black tracking-tight text-foreground">EduSpark</p>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
