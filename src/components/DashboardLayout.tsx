import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  Search,
  Command as CommandIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/dashboard/GlobalSearch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  navItems: { label: string; href: string; icon: LucideIcon; badge?: string | number }[];
}

const COLLAPSE_KEY = "eduspark.sidebar.collapsed";

export function DashboardLayout({ children, title, subtitle, navItems }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { profile, role, signOut } = useAuth();

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const userName = profile?.full_name || "User";
  const userEmail = profile?.email || "";
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Student";
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url || "";

  const dashboardHref =
    role === "admin" ? "/admin" :
    role === "tutor" ? "/tutor" :
    role === "moderator" ? "/moderator" :
    role === "technician" ? "/technician" : "/dashboard";

  const handleLogout = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  const isActiveRoute = (href: string) =>
    location.pathname === href ||
    (href !== navItems[0]?.href && location.pathname.startsWith(href + "/"));

  const SIDEBAR_W = collapsed ? 76 : 272;

  return (
    <TooltipProvider delayDuration={150}>
    <div className="min-h-screen bg-background flex">
      {/* ───────── SIDEBAR ───────── */}
      <motion.aside
        initial={false}
        animate={{ width: SIDEBAR_W }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border/60 bg-gradient-to-b from-sidebar/95 via-sidebar/95 to-sidebar/90 backdrop-blur-2xl"
      >
        {/* Decorative glow */}
        <div className="absolute top-20 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-32 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-[60px] pointer-events-none" />

        {/* Logo */}
        <div className={`relative h-16 flex items-center border-b border-border/60 ${collapsed ? "justify-center px-2" : "px-4"}`}>
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden group min-w-0">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-105 transition-all flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col leading-none overflow-hidden whitespace-nowrap"
                >
                  <span className="text-sm font-black tracking-tight text-foreground">EduSpark</span>
                  <span className="text-[10px] text-muted-foreground capitalize mt-0.5">{displayRole} Suite</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Floating rail toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="absolute top-20 -right-3 z-50 w-6 h-6 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-lg transition-all flex items-center justify-center"
            >
              <motion.div
                key={collapsed ? "open" : "close"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.18 }}
              >
                {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
              </motion.div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>

        {/* Search trigger */}
        <div className={`pt-3 ${collapsed ? "px-2" : "px-3"}`}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full h-9 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Search (⌘K)</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full h-9 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/40 flex items-center gap-2.5 px-3 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Search…</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background/80 border border-border/60 text-[9px] font-mono">
                <CommandIcon className="w-2.5 h-2.5" />K
              </kbd>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className={`relative flex-1 overflow-y-auto py-4 space-y-0.5 ${collapsed ? "px-2" : "px-2.5"}`}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 overflow-hidden"
              >
                Workspace
              </motion.p>
            )}
          </AnimatePresence>
          {navItems.map((item) => {
            const active = isActiveRoute(item.href);
            const link = (
              <Link
                key={item.href}
                to={item.href}
                className={`group relative flex items-center rounded-xl text-sm font-medium transition-colors ${
                  collapsed ? "justify-center w-full h-10" : "gap-3 px-3 py-2.5"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border border-primary/20 shadow-sm shadow-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {active && !collapsed && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-primary to-accent"
                  />
                )}
                <item.icon
                  className={`relative w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${
                    active ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                  }`}
                />
                {!collapsed && (
                  <span
                    className={`relative flex-1 truncate ${
                      active ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className="relative text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/15 text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                      {item.badge}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : link;
          })}
        </nav>

        {/* Upgrade card */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative mx-3 mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 border border-primary/20 overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/20 blur-2xl" />
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-xs font-black text-foreground">Upgrade to Pro</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Unlock advanced analytics & priority support.
                  </p>
                  <button className="mt-2.5 w-full text-[11px] font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-lg py-1.5 transition-opacity">
                    Get Pro
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile footer */}
        <div className={`relative border-t border-border/60 ${collapsed ? "p-2 flex justify-center" : "p-2.5"}`}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center ring-1 ring-primary/20 overflow-hidden hover:ring-primary/40 transition-all"
                  aria-label="Open profile menu"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-primary">{initials}</span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-sidebar" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                <div className="font-semibold">{userName}</div>
                <div className="text-muted-foreground">{userEmail}</div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors group"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black text-primary">{initials}</span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-sidebar" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
              </div>
            </button>
          )}

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute z-40 ${
                    collapsed ? "left-full ml-3 bottom-2 w-64" : "left-2 right-2 bottom-[68px]"
                  } rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden`}
                >
                  <div className="p-3.5 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-sm font-black text-primary overflow-hidden ring-1 ring-primary/20">
                        {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{userName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { icon: User, label: "My Profile", to: `${dashboardHref}/profile` },
                      { icon: Settings, label: "Settings", to: `${dashboardHref}/settings` },
                      { icon: HelpCircle, label: "Help & Support", to: "/contact" },
                    ].map((it) => (
                      <Link
                        key={it.label}
                        to={it.to}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <it.icon className="w-3.5 h-3.5" />
                        {it.label}
                      </Link>
                    ))}
                  </div>
                  <div className="p-1.5 border-t border-border flex items-center justify-between gap-1">
                    <button
                      onClick={handleLogout}
                      className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                    <ThemeToggle />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* ───────── MAIN ───────── */}
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: SIDEBAR_W }}>
        <header className="h-16 border-b border-border/60 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
          <div>
            <h1 className="text-base font-black text-foreground leading-tight tracking-tight">{title}</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/60 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open search"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[9px] font-mono">
                <CommandIcon className="w-2.5 h-2.5" />K
              </kbd>
            </button>
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>

        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>

      <GlobalSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        navItems={navItems}
        dashboardHref={dashboardHref}
      />
    </div>
    </TooltipProvider>
  );
}
