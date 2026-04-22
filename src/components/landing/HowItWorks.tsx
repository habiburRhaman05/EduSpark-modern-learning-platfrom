import { motion } from "framer-motion";
import { Search, Calendar, Video, Trophy, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover your tutor", desc: "Browse verified profiles, filter by subject, price and availability — pick the perfect match in minutes.", accent: "from-primary/20 to-primary/5", iconBg: "bg-primary/15", iconColor: "text-primary" },
  { icon: Calendar, title: "Book a session", desc: "Choose a time slot, confirm payment securely, and receive instant confirmation — no back‑and‑forth.", accent: "from-accent/20 to-accent/5", iconBg: "bg-accent/15", iconColor: "text-accent" },
  { icon: Video, title: "Learn live, 1‑on‑1", desc: "Join HD video sessions with whiteboards, screen sharing and recordings — built for real learning.", accent: "from-warning/20 to-warning/5", iconBg: "bg-warning/15", iconColor: "text-warning" },
  { icon: Trophy, title: "Track your progress", desc: "Review notes, leave feedback, and watch your skills sharpen with every session you complete.", accent: "from-success/20 to-success/5", iconBg: "bg-success/15", iconColor: "text-success" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            How{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">EduSpark</span>{" "}
            works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">From your first search to your first breakthrough — four simple steps.</p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[58px] left-[12%] right-[12%] h-px">
            <svg width="100%" height="2" preserveAspectRatio="none" className="overflow-visible">
              <motion.line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="hsl(var(--border))"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                <div className="relative rounded-3xl bg-card border border-border/60 p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-background border border-border/60 shadow-md flex items-center justify-center text-xs font-black text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${step.accent} border border-border/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-6 h-6 ${step.iconColor}`} strokeWidth={1.75} />
                    <div className={`absolute inset-0 rounded-2xl ${step.iconBg} blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10`} />
                  </div>

                  <h3 className="font-bold text-base text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

                  {i < steps.length - 1 && (
                    <div className="lg:hidden mt-5 flex items-center text-xs text-muted-foreground gap-1">
                      Next step <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
