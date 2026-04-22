import { motion } from "framer-motion";
import { Shield, Video, Clock, Award, BookOpen, Users, Sparkles } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified experts", desc: "Every tutor is vetted with background checks, credential verification and a demo session.", color: "primary" },
  { icon: Video, title: "HD video classroom", desc: "Crystal‑clear video, interactive whiteboards, screen sharing and full session recordings.", color: "accent" },
  { icon: Clock, title: "Instant booking", desc: "24/7 availability with real‑time scheduling and instant payment confirmation.", color: "warning" },
  { icon: Award, title: "Money‑back guarantee", desc: "Not satisfied with a session? Get a full refund or rebook with another tutor — no questions asked.", color: "success" },
  { icon: BookOpen, title: "200+ subjects", desc: "From advanced calculus to creative writing — find experts across every academic and creative field.", color: "primary" },
  { icon: Users, title: "Community & support", desc: "Join study groups, peer forums and 24/7 human support whenever you hit a roadblock.", color: "accent" },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", ring: "ring-primary/20" },
  accent: { bg: "bg-accent/10", text: "text-accent", ring: "ring-accent/20" },
  warning: { bg: "bg-warning/10", text: "text-warning", ring: "ring-warning/20" },
  success: { bg: "bg-success/10", text: "text-success", ring: "ring-success/20" },
};

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Why choose us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">excel</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A premium learning experience designed to make every session count.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl bg-card border border-border/60 p-7 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${c.bg} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`inline-flex w-12 h-12 rounded-2xl ${c.bg} ring-1 ${c.ring} items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-5 h-5 ${c.text}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
