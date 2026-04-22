import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, BookOpen, CreditCard, ShieldCheck, GraduationCap, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/Logo";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  ts: number;
}

const knowledgeBase: { match: string[]; answer: string }[] = [
  {
    match: ["what is eduspark", "about eduspark", "about platform"],
    answer:
      "EduSpark is a premium 1‑on‑1 online tutoring platform. We connect ambitious learners with **verified expert tutors** across 200+ subjects — from Mathematics and Coding to IELTS prep and Music. Every session is live, interactive, and tailored to you.",
  },
  {
    match: ["how", "work", "start", "begin"],
    answer:
      "It takes under 2 minutes:\n\n1. **Discover** — browse verified tutor profiles, filter by subject, price and availability.\n2. **Book** — pick a slot, pay securely, get instant confirmation.\n3. **Learn live** — join HD video with whiteboard, screen share and recordings.\n4. **Track** — review notes and watch your progress in your dashboard.",
  },
  {
    match: ["price", "pricing", "cost", "rate", "fee"],
    answer:
      "Tutors set their own rates, typically **$15–$120/hr** depending on subject and experience. There are no subscriptions — you only pay per session. New learners get a **free 15‑minute intro** with most tutors.",
  },
  {
    match: ["refund", "guarantee", "money back", "satisfied"],
    answer:
      "We offer a **100% satisfaction guarantee**. If your first session isn't great, contact support within 24 hours and we'll refund it in full or match you with another tutor — your choice.",
  },
  {
    match: ["tutor", "verified", "vetting", "quality"],
    answer:
      "Every tutor passes a **5‑step verification**: identity check, credential review, subject knowledge test, demo session and ongoing rating audits. Only the top **3%** of applicants make it onto EduSpark.",
  },
  {
    match: ["subject", "what can i learn", "available"],
    answer:
      "200+ subjects: **Mathematics, Sciences, Programming, Languages, Business, Music & Arts, Test Prep, Writing** and more. If you can name it, we likely have an expert for it.",
  },
  {
    match: ["become tutor", "teach", "apply tutor", "join as tutor"],
    answer:
      "Love teaching? Sign up, complete your tutor profile, upload credentials and book a 20‑minute demo with our team. Approved tutors keep **80–90%** of every booking.",
  },
  {
    match: ["payment", "pay", "card", "stripe"],
    answer:
      "We accept all major credit/debit cards through encrypted payments. Funds are held safely until your session is completed — you're always protected.",
  },
  {
    match: ["video", "call", "platform", "tools"],
    answer:
      "**EduSpark Live** is our built‑in classroom: 1080p video, multi‑user whiteboard, screen share, live captions in 40+ languages and an AI session recap delivered the moment you hang up.",
  },
  {
    match: ["contact", "support", "help me"],
    answer:
      "Our learner support team replies within **2 hours** on weekdays. Email **support@eduspark.com** or visit the Contact page anytime.",
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();
  if (!lower) return "Ask me anything about EduSpark — pricing, tutors, subjects, the live classroom or how to get started ✨";
  if (/^(hi|hello|hey|yo|sup|hola)\b/.test(lower)) {
    return "Hey there 👋 I'm Spark, your EduSpark guide. I can help you find the right tutor, explain pricing, or walk you through booking your first session. What's on your mind?";
  }
  if (/thank|thanks|thx/.test(lower)) return "You're very welcome! Anything else I can help with? ✨";
  for (const entry of knowledgeBase) {
    if (entry.match.some((k) => lower.includes(k))) return entry.answer;
  }
  return "Great question! I don't have an answer ready for that, but our learner support team replies within 2 hours at **support@eduspark.com**. In the meantime, try asking about pricing, tutors, subjects or how a session works.";
}

const quickActions = [
  { icon: GraduationCap, label: "How does it work?", prompt: "How does EduSpark work?" },
  { icon: CreditCard, label: "Pricing", prompt: "How much does it cost?" },
  { icon: ShieldCheck, label: "Tutor quality", prompt: "How are tutors verified?" },
  { icon: BookOpen, label: "Subjects", prompt: "What subjects can I learn?" },
];

function formatRich(text: string) {
  // Lightweight markdown: **bold** + line breaks
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold text-foreground">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      ts: Date.now(),
      content:
        "Hey 👋 I'm **Spark**, your EduSpark guide. I can help you discover tutors, understand pricing, or get started in under 2 minutes. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: value, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, role: "bot", content: findAnswer(value), ts: Date.now() },
      ]);
    }, 700 + Math.random() * 400);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-xl shadow-primary/40 flex items-center justify-center group"
        aria-label="Open chat"
      >
        {/* Pulse halo */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl bg-primary/40 animate-ping opacity-60 -z-10" />
        )}
        <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative">
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-background" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-9rem)] rounded-3xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }} />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <LogoMark size="md" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success ring-2 ring-card" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      Spark <Sparkles className="w-3 h-3 text-primary" />
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online · usually replies instantly
                    </p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "bot" && (
                      <div className="shrink-0 mt-0.5">
                        <LogoMark size="sm" />
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "bot"
                          ? "bg-muted/70 text-foreground rounded-2xl rounded-tl-md"
                          : "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl rounded-tr-md shadow-md shadow-primary/20"
                      }`}
                    >
                      {formatRich(msg.content)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-2 items-end">
                    <LogoMark size="sm" />
                    <div className="px-4 py-3 bg-muted/70 rounded-2xl rounded-tl-md flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70"
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick actions — only show after welcome */}
              {messages.length === 1 && !typing && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-2"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Quick questions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => send(q.prompt)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/30 text-left text-xs font-medium text-foreground transition-all hover:-translate-y-0.5"
                      >
                        <q.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{q.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/60 bg-card/80">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Spark anything…"
                  className="h-11 rounded-xl bg-muted/60 border-border/50 text-sm focus-visible:ring-primary/40"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim()}
                  className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent hover:opacity-90 p-0 flex-shrink-0 shadow-md shadow-primary/30 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Powered by <span className="font-bold text-foreground">EduSpark AI</span> · Replies are illustrative
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
