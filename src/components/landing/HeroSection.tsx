import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Star, Sparkles, PlayCircle, GraduationCap, BookOpen, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const fadeUp: any = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger: any = { visible: { transition: { staggerChildren: 0.08 } } };

export function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query ? `/tutors?search=${encodeURIComponent(query)}` : "/tutors");
  };

  return (
    <section className="relative pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/15 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.08),transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: copy */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="lg:col-span-7">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Live · Trusted by 50,000+ learners worldwide
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-[2.75rem] sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight mb-6">
              Launch your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  learning journey
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    d="M2 8 Q75 2 150 6 T298 4"
                    stroke="hsl(var(--accent))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              <br />
              with world-class tutors.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              EduSpark connects ambitious learners with verified expert tutors for personalized 1‑on‑1 sessions. Master any subject, on your pace, with interactive HD lessons.
            </motion.p>

            <motion.form variants={fadeUp} onSubmit={onSearch} className="flex flex-col sm:flex-row items-stretch gap-3 mb-8 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subject or tutor — e.g. Calculus"
                  className="pl-11 h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/30"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                Start learning <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </motion.form>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["SC", "JM", "PS", "AH"].map((i, idx) => (
                    <div key={idx} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                  ))}
                  <span className="ml-1 font-semibold text-foreground">4.9</span>
                  <span>· 10k+ reviews</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary" /> Verified experts</div>
              <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent" /> Instant booking</div>
            </motion.div>
          </motion.div>

          {/* Right: illustration cluster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative aspect-[4/5] max-w-md mx-auto">
      {/* Main hero card with portrait */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-4 top-8 bottom-12 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-border/60 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden"
      >
        {/* Decorative blob */}
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d="M0,300 C100,250 150,400 250,350 C350,300 400,400 400,500 L0,500 Z" fill="url(#g1)" />
          <circle cx="320" cy="120" r="80" fill="hsl(var(--accent)/0.2)" />
        </svg>

        {/* Center figure / avatar block */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-44 h-44 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/40 ring-4 ring-background/40"
          >
            <GraduationCap className="w-20 h-20 text-primary-foreground" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Floating UI chips inside card */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 left-6 px-3 py-2 rounded-xl bg-background/90 backdrop-blur border border-border/60 shadow-lg flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground leading-none">Achievement</p>
            <p className="text-xs font-bold text-foreground">Top 1% scorer</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-6 right-6 px-3 py-2 rounded-xl bg-background/90 backdrop-blur border border-border/60 shadow-lg flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground leading-none">Active now</p>
            <p className="text-xs font-bold text-foreground">120+ courses</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating tutor chip — top right */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -top-2 -right-2 z-10 px-3 py-2.5 rounded-2xl bg-card border border-border/60 shadow-xl flex items-center gap-2.5"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-[11px] font-bold text-primary">SC</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-card" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground leading-tight">Dr. Sarah Chen</p>
          <p className="text-[10px] text-muted-foreground">Mathematics · Online</p>
        </div>
      </motion.div>

      {/* Live session chip — bottom left */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute -bottom-2 -left-2 z-10 px-4 py-3 rounded-2xl bg-card border border-border/60 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <PlayCircle className="w-4 h-4 text-destructive" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-destructive">Live · 23:14</p>
        </div>
        <p className="text-xs font-semibold text-foreground">Calculus Masterclass</p>
        <p className="text-[10px] text-muted-foreground">847 learners watching</p>
      </motion.div>

      {/* Stats badge top-left */}
      <motion.div
        initial={{ rotate: -8 }}
        animate={{ y: [0, -6, 0], rotate: -8 }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-4 z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-warning to-warning/80 shadow-xl flex flex-col items-center justify-center text-warning-foreground"
      >
        <Sparkles className="w-5 h-5 mb-1" />
        <p className="text-2xl font-black leading-none">420K+</p>
        <p className="text-[9px] font-medium opacity-90 mt-0.5">happy learners</p>
      </motion.div>
    </div>
  );
}
