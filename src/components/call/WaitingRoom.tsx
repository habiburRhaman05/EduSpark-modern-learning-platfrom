import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { DevicePreview } from "./DevicePreview";

interface Props {
  scheduledAt: string;
  joinAt: string;
  tutorName?: string;
  subject?: string;
  onReady?: () => void;
}

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { ms, h, m, s };
}

export function WaitingRoom({ scheduledAt, joinAt, tutorName, subject, onReady }: Props) {
  const target = new Date(joinAt).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const i = setInterval(() => {
      const next = diff(target);
      setT(next);
      if (next.ms === 0) { clearInterval(i); onReady?.(); }
    }, 1000);
    return () => clearInterval(i);
  }, [target, onReady]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Waiting Room
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your session starts soon
            </h1>
            <p className="text-muted-foreground">
              The room will open automatically 15 minutes before your scheduled time.
            </p>
          </div>

          {/* Countdown */}
          <div className="bento-card bg-gradient-to-br from-primary/10 via-card to-accent/5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Time until you can join</div>
            <div className="flex items-end gap-3">
              {[
                { v: t.h, l: "Hours" },
                { v: t.m, l: "Min" },
                { v: t.s, l: "Sec" },
              ].map((u, i) => (
                <motion.div key={u.l} className="flex-1 text-center">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent tabular-nums">
                    {pad(u.v)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{u.l}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Session info */}
          <div className="space-y-3">
            {subject && (
              <Row icon={<Calendar className="w-4 h-4" />} label="Subject" value={subject} />
            )}
            <Row
              icon={<Clock className="w-4 h-4" />}
              label="Scheduled"
              value={new Date(scheduledAt).toLocaleString()}
            />
            {tutorName && (
              <Row icon={<User className="w-4 h-4" />} label="With" value={tutorName} />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="text-sm font-medium text-foreground">Test your camera & microphone</div>
          <DevicePreview />
          <p className="text-xs text-muted-foreground">
            Make sure both work before joining. You'll be auto-admitted at {new Date(target).toLocaleTimeString()}.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
