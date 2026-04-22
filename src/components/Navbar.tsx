import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Tutors", href: "/tutors" },
  { label: "Categories", href: "/categories", mega: true },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();
  const { user, profile, role, signOut } = useAuth();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  const dashboardHref =
    role === "admin" ? "/admin" :
    role === "tutor" ? "/tutor" :
    role === "moderator" ? "/moderator" :
    role === "technician" ? "/technician" : "/dashboard";
  const initials =
    profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          paddingTop: scrolled ? 8 : 16,
          paddingBottom: scrolled ? 8 : 16,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            animate={{
              backgroundColor: scrolled ? "hsl(var(--card) / 0.85)" : "hsl(var(--background) / 0.4)",
              borderColor: scrolled ? "hsl(var(--border) / 0.9)" : "hsl(var(--border) / 0.25)",
              boxShadow: scrolled
                ? "0 12px 40px -12px hsl(var(--primary) / 0.15), 0 4px 16px -4px hsl(var(--background) / 0.4), inset 0 1px 0 0 hsl(var(--foreground) / 0.04)"
                : "0 2px 16px -4px hsl(var(--background) / 0.2)",
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border backdrop-blur-2xl backdrop-saturate-150 overflow-hidden"
            style={{ WebkitBackdropFilter: "blur(28px) saturate(160%)" }}
          >
            {/* Inner glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />

            <div className="relative flex items-center justify-between h-14 px-4 lg:px-5">
              {/* Logo */}
              <Logo size="md" />

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const active = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => link.mega && setMegaOpen(true)}
                      onMouseLeave={() => link.mega && setMegaOpen(false)}
                    >
                      <Link
                        to={link.href}
                        className={`relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors flex items-center gap-1 ${
                          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-lg bg-muted/60 border border-border/40"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{link.label}</span>
                        {link.mega && <ChevronDown className="relative w-3 h-3 opacity-60" />}
                      </Link>
                      {link.mega && (
                        <AnimatePresence>
                          {megaOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px]"
                            >
                              <div className="rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-2xl shadow-2xl shadow-background/60 p-3 grid grid-cols-2 gap-1.5">
                                {(categories.length ? categories : []).slice(0, 8).map((cat: any) => (
                                  <Link
                                    key={cat.id || cat.name}
                                    to={`/categories?category=${encodeURIComponent(cat.name)}`}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                                      {cat.icon || "📚"}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[13px] font-semibold text-foreground truncate">{cat.name}</p>
                                      <p className="text-[11px] text-muted-foreground truncate">
                                        {(cat.subjects?.length || 0)} subjects
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                                {!categories.length && (
                                  <p className="col-span-2 text-xs text-muted-foreground text-center py-6">
                                    Loading categories…
                                  </p>
                                )}
                                <Link
                                  to="/categories"
                                  className="col-span-2 mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors"
                                >
                                  Browse all categories <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right cluster */}
              <div className="hidden lg:flex items-center gap-2">
                <ThemeToggle />
                {user ? (
                  <>
                    <Link to={dashboardHref}>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-lg">
                        Dashboard
                      </Button>
                    </Link>
                    <Link to={dashboardHref}>
                      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xs font-black text-primary ring-1 ring-primary/30 hover:ring-2 transition-all cursor-pointer">
                        {initials}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-background" />
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        size="sm"
                        className="rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30 font-semibold"
                      >
                        Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 lg:hidden">
                <ThemeToggle />
                <button
                  className="w-9 h-9 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-center text-foreground"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Menu"
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mx-3 mt-2"
            >
              <div className="rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-2xl shadow-2xl p-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-border/60 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link to={dashboardHref}>
                        <Button variant="ghost" className="w-full rounded-lg">Dashboard</Button>
                      </Link>
                      <Button variant="outline" className="w-full rounded-lg" onClick={() => signOut()}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost" className="w-full rounded-lg">Sign In</Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
