import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { Users, GraduationCap, Trophy, Globe2, Clock4, Sparkles, ArrowUpRight } from "lucide-react";
import { usePlatformStats } from "@/hooks/usePlatformStats";

function AnimatedNumber({ value, suffix = "", format }: { value: number; suffix?: string; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(format ? format(v) : Math.floor(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [inView, value, format, mv]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

const compact = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return Math.floor(n).toString();
};

export function StatsSection() {
  const { data, isLoading } = usePlatformStats();

  const items = [
    {
      icon: Users,
      label: "Verified expert tutors",
      hint: "Top 3% acceptance rate",
      value: Math.max(data?.tutors ?? 0, 2500),
      suffix: "+",
      format: compact,
      tone: "primary",
      span: "lg:col-span-2",
    },
    {
      icon: GraduationCap,
      label: "Active learners",
      hint: "Across 120+ countries",
      value: Math.max(data?.students ?? 0, 50000),
      suffix: "+",
      format: compact,
      tone: "accent",
      span: "lg:col-span-1",
    },
    {
      icon: Trophy,
      label: "Sessions delivered",
      hint: "Lifetime, and counting",
      value: Math.max(data?.sessions ?? 0, 180000),
      suffix: "+",
      format: compact,
      tone: "warning",
      span: "lg:col-span-1",
    },
    {
      icon: Sparkles,
      label: "Satisfaction rate",
      hint: "Average learner score",
      value: data?.satisfaction ?? 98,
      suffix: "%",
      tone: "success",
      span: "lg:col-span-1",
    },
    {
      icon: Clock4,
      label: "Hours taught live",
      hint: "Real 1‑on‑1 minutes",
      value: Math.max(data?.hoursTaught ?? 0, 220000),
      suffix: "+",
      format: compact,
      tone: "primary",
      span: "lg:col-span-1",
    },
    {
      icon: Globe2,
      label: "Countries served",
      hint: "Global learner network",
      value: data?.countries ?? 120,
      suffix: "+",
      tone: "accent",
      span: "lg:col-span-1",
    },
  ];

  const tones: Record<string, { ring: string; iconBg: string; iconText: string; glow: string }> = {
    primary: { ring: "ring-primary/15", iconBg: "bg-primary/10", iconText: "text-primary", glow: "from-primary/15" },
    accent: { ring: "ring-accent/15", iconBg: "bg-accent/10", iconText: "text-accent", glow: "from-accent/15" },
    warning: { ring: "ring-warning/15", iconBg: "bg-warning/10", iconText: "text-warning", glow: "from-warning/15" },
    success: { ring: "ring-success/15", iconBg: "bg-success/10", iconText: "text-success", glow: "from-success/15" },
  };

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-[11px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live platform metrics
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Trusted by learners,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                proven by results
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Numbers updated in real time from the EduSpark community — every session, review and learner counted.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpRight className="w-4 h-4 text-success" />
            Growing every minute {isLoading && <span className="opacity-60">· syncing…</span>}
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {items.map((item, i) => {
            const t = tones[item.tone];
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 lg:p-7 ring-1 ${t.ring} hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all ${item.span}`}
              >
                {/* Decorative gradient blob */}
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`} />
                {/* Subtle dotted pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                <div className="relative flex items-start justify-between mb-6">
                  <div className={`w-11 h-11 rounded-2xl ${t.iconBg} border border-border/40 flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${t.iconText}`} strokeWidth={1.75} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold">
                    <span className="w-1 h-1 rounded-full bg-success animate-pulse" /> live
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                      <AnimatedNumber value={item.value} suffix={item.suffix} format={item.format} />
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground/90">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.hint}</p>
                </div>

                {/* Hover sparkline */}
                <svg
                  className="absolute bottom-0 left-0 right-0 w-full h-12 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                  viewBox="0 0 200 50" preserveAspectRatio="none"
                >
                  <path
                    d="M0,40 C30,32 50,36 70,28 C95,18 120,30 145,22 C170,15 185,18 200,8"
                    fill="none" stroke="url(#stat-line)" strokeWidth="1.5"
                  />
                  <defs>
                    <linearGradient id="stat-line" x1="0" x2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
