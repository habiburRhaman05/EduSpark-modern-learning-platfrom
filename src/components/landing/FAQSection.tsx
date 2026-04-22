import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, MessageCircleQuestion } from "lucide-react";
import { faqs } from "@/lib/mock-data";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" /> FAQs
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Got{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">questions?</span>
            </h2>
            <p className="text-muted-foreground mb-6">Everything you need to know about EduSpark. Can't find an answer? Reach out and our team will get back within 24 hours.</p>
            <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/60">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircleQuestion className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Still curious?</p>
                <p className="text-xs text-muted-foreground">admin@eduspark.com</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className={`rounded-2xl border bg-card overflow-hidden transition-colors ${isOpen ? "border-primary/40 shadow-lg shadow-primary/5" : "border-border/60"}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{faq.q}</h3>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-primary text-primary-foreground rotate-45" : "bg-muted text-foreground"}`}>
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
