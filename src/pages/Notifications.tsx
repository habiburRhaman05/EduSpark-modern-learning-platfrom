import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Check, CheckCheck, Inbox, Filter } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TYPES = ["all", "success", "error", "warning", "info"] as const;

const typeColor = (t?: string | null) => {
  switch (t) {
    case "success": return "text-success bg-success/10 border-success/20";
    case "error": return "text-destructive bg-destructive/10 border-destructive/20";
    case "warning": return "text-warning bg-warning/10 border-warning/20";
    default: return "text-primary bg-primary/10 border-primary/20";
  }
};

export default function Notifications() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { data: notifs = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<typeof TYPES[number]>("all");

  const back =
    role === "admin" ? "/admin" :
    role === "tutor" ? "/tutor" :
    role === "moderator" ? "/moderator" :
    role === "technician" ? "/technician" : "/dashboard";

  const filtered = (notifs as any[]).filter((n) => {
    if (readFilter === "unread" && n.is_read) return false;
    if (readFilter === "read" && !n.is_read) return false;
    if (typeFilter !== "all" && (n.type || "info") !== typeFilter) return false;
    return true;
  });
  const unreadCount = (notifs as any[]).filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(back)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={() => markAll.mutate()} variant="outline" size="sm" className="rounded-xl">
              <CheckCheck className="w-3.5 h-3.5 mr-2" /> Mark all read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap mb-5 p-3 rounded-2xl bg-muted/30 border border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Filter className="w-3.5 h-3.5" /> Filter:</div>
          <div className="flex gap-1">
            {(["all", "unread", "read"] as const).map((r) => (
              <button key={r} onClick={() => setReadFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  readFilter === r ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                }`}>{r}</button>
            ))}
          </div>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex gap-1 flex-wrap">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  typeFilter === t ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-muted/20">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No notifications match your filters.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((n: any, i: number) => {
              const Body = (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`p-4 rounded-2xl border flex gap-3 transition-colors ${
                    !n.is_read ? "bg-primary/[0.04] border-primary/20" : "bg-card border-border hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${typeColor(n.type)}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-foreground">{n.title}</p>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    </div>
                    {n.message && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-muted-foreground/70">{new Date(n.created_at).toLocaleString()}</p>
                      {!n.is_read && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead.mutate(n.id); }}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
              return (
                <li key={n.id}>
                  {n.link ? (
                    <Link to={n.link} onClick={() => { if (!n.is_read) markRead.mutate(n.id); }}>{Body}</Link>
                  ) : Body}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
