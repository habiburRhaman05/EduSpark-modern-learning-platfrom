import { motion } from "framer-motion";
import {
  Video, Mic, MonitorUp, PenTool, MessageSquare, Users, Sparkles,
  Captions, Wand2, Shield, CheckCircle2, Volume2,
} from "lucide-react";

const features = [
  { icon: Video, title: "Crystal clear HD video", desc: "Adaptive 1080p streams with sub‑200ms latency on any connection." },
  { icon: PenTool, title: "Interactive whiteboard", desc: "Multi‑user shapes, math tools, sticky notes — saved automatically." },
  { icon: MonitorUp, title: "Screen + tab share", desc: "Share an entire screen, a single tab, or just the audio of a video." },
  { icon: Captions, title: "Live captions & translate", desc: "Real‑time subtitles in 40+ languages, perfect for global learners." },
  { icon: Wand2, title: "AI session recap", desc: "Notes, action items and a summary delivered the moment you hang up." },
  { icon: Shield, title: "End‑to‑end secure", desc: "Encrypted media, single‑use room links, full GDPR compliance." },
];

export function VideoCallSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[36rem] h-[36rem] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Live classroom
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            A video classroom built{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              for real learning
            </span>
          </h2>
          <p className="text-muted-foreground">
            Not another meeting tool — every pixel of EduSpark Live is designed for tutors and students to collaborate in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Mock video call UI */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative"
          >
            {/* Glow */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-3xl opacity-60 -z-10 rounded-[3rem]" />

            <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Live · Calculus 201 · 47:12
                </div>
                <div className="text-[11px] text-muted-foreground hidden sm:block">live.eduspark.app/r/x9k2</div>
              </div>

              {/* Stage */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-muted/50 via-background to-muted/30 p-3 sm:p-5">
                {/* Whiteboard */}
                <div className="absolute inset-3 sm:inset-5 rounded-2xl bg-gradient-to-br from-card to-muted/40 border border-border/50 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  {/* Equation */}
                  <div className="absolute top-6 left-6 right-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Today's lesson</p>
                    <p className="font-serif italic text-2xl sm:text-3xl text-foreground">
                      ∫ <span className="text-primary">x²</span> dx = <span className="text-accent">x³⁄3</span> + C
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4 }}
                      className="mt-3 h-0.5 bg-gradient-to-r from-primary via-accent to-transparent rounded-full"
                    />
                  </div>

                  {/* Sketched curve */}
                  <svg viewBox="0 0 400 200" className="absolute bottom-4 left-4 right-4 h-32 sm:h-40 w-[calc(100%-2rem)]">
                    <motion.path
                      d="M10,180 Q100,140 180,100 T390,20"
                      fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.6 }}
                    />
                    <motion.circle
                      cx="220" cy="80" r="5" fill="hsl(var(--accent))"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.6, type: "spring", damping: 8 }}
                    />
                  </svg>
                </div>

                {/* Tutor video tile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-8 right-8 w-32 sm:w-44 aspect-[4/3] rounded-2xl border-2 border-primary/40 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/30 via-primary/15 to-accent/20"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-black text-3xl bg-gradient-to-br from-primary to-accent">
                    SC
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur text-[10px] font-bold text-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" /> Dr. Sarah · Tutor
                  </div>
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-background/70 backdrop-blur flex items-center justify-center">
                    <Mic className="w-2.5 h-2.5 text-success" />
                  </div>
                </motion.div>

                {/* Student video tile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute top-8 right-8 w-24 sm:w-32 aspect-[4/3] rounded-xl border-2 border-accent/30 shadow-xl overflow-hidden bg-gradient-to-br from-accent/30 to-warning/20 hidden sm:block"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-accent-foreground font-black text-xl bg-gradient-to-br from-accent to-warning">
                    AJ
                  </div>
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur text-[9px] font-semibold text-foreground">
                    Alex · You
                  </div>
                </motion.div>

                {/* Floating reaction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -40, -80] }}
                  transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatDelay: 4 }}
                  className="absolute bottom-32 left-12 text-2xl"
                >
                  💡
                </motion.div>

                {/* Live captions */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute bottom-8 left-8 max-w-[55%] hidden sm:block"
                >
                  <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg">
                    <Captions className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <p className="text-[11px] leading-relaxed text-foreground">
                      <span className="text-muted-foreground">[Sarah]</span> So the antiderivative gives us the area under the curve…
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Control bar */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl bg-success/15 text-success flex items-center justify-center"><Mic className="w-4 h-4" /></button>
                  <button className="w-9 h-9 rounded-xl bg-success/15 text-success flex items-center justify-center"><Video className="w-4 h-4" /></button>
                  <button className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hidden sm:flex"><MonitorUp className="w-4 h-4" /></button>
                  <button className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hidden sm:flex"><MessageSquare className="w-4 h-4" /></button>
                  <button className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hidden sm:flex"><Volume2 className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-[11px] font-medium text-muted-foreground">
                    <Users className="w-3 h-3" /> 2
                  </div>
                  <button className="px-3 sm:px-4 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold">End</button>
                </div>
              </div>
            </div>

            {/* Floating chips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -left-2 sm:-left-6 top-12 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-card border border-border/60 shadow-xl"
            >
              <div className="w-7 h-7 rounded-xl bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-foreground leading-none">Network excellent</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">142ms · 1080p</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -right-2 sm:-right-6 bottom-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-card border border-border/60 shadow-xl"
            >
              <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center">
                <Wand2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-foreground leading-none">AI recap ready</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">3 action items</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature list */}
          <div className="lg:col-span-5">
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="group relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-4 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-border/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <f.icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
