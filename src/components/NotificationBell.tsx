import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Inbox } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";

const typeColor = (t?: string | null) => {
  switch (t) {
    case "success": return "text-success bg-success/10";
    case "error": return "text-destructive bg-destructive/10";
    case "warning": return "text-warning bg-warning/10";
    default: return "text-primary bg-primary/10";
  }
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifs = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unread = notifs.filter((n: any) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center ring-2 ring-background">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-[360px] max-h-[480px] rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
                <div>
                  <p className="text-sm font-bold text-foreground">Notifications</p>
                  <p className="text-[11px] text-muted-foreground">{unread > 0 ? `${unread} unread` : "All caught up"}</p>
                </div>
                {unread > 0 && (
                  <button onClick={() => markAll.mutate()} className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="px-4 py-2 border-b border-border bg-muted/20">
                <Link
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center justify-center gap-1"
                >
                  See all notifications →
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />)}
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="p-8 text-center">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/40">
                    {notifs.map((n: any) => {
                      const Inner = (
                        <div className={`px-4 py-3 hover:bg-muted/40 transition-colors flex gap-3 ${!n.is_read ? "bg-primary/[0.03]" : ""}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColor(n.type)}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                            {n.message && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>}
                            <p className="text-[10px] text-muted-foreground/70 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                          {!n.is_read && (
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead.mutate(n.id); }}
                              className="self-start text-muted-foreground hover:text-primary"
                              aria-label="Mark read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                      return (
                        <li key={n.id}>
                          {n.link ? (
                            <Link to={n.link} onClick={() => { setOpen(false); if (!n.is_read) markRead.mutate(n.id); }}>
                              {Inner}
                            </Link>
                          ) : Inner}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
