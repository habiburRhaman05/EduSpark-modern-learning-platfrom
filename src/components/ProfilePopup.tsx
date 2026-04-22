import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, BookOpen, HelpCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface ProfilePopupProps {
  userName: string;
  userRole?: string;
  avatarInitials: string;
}

export function ProfilePopup({ userName, userRole = "Student", avatarInitials }: ProfilePopupProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dashboardHref = userRole === "Admin" ? "/admin" : userRole === "Tutor" ? "/tutor" : userRole === "Moderator" ? "/moderator" : userRole === "Technician" ? "/technician" : "/dashboard";

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary group-hover:ring-2 ring-primary/30 transition-all">
          {avatarInitials}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card shadow-xl shadow-background/50 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link to={dashboardHref} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <BookOpen className="w-4 h-4" /> Dashboard
              </Link>
              <Link to={`${dashboardHref}/profile`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link to={`${dashboardHref}/settings`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <HelpCircle className="w-4 h-4" /> Help & Support
              </Link>
            </div>

            <div className="p-2 border-t border-border flex items-center justify-between">
              <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
