import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import {
  Compass,
  GraduationCap,
  Newspaper,
  LogOut,
  Settings,
  User,
  Sun,
  Moon,
  HelpCircle,
  Info,
  Mail,
  Sparkles,
  LucideIcon,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: NavItem[];
  dashboardHref: string;
}

const PUBLIC_PAGES: NavItem[] = [
  { label: "Browse Tutors", href: "/tutors", icon: GraduationCap },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Help & FAQ", href: "/contact", icon: HelpCircle },
];

export function GlobalSearch({ open, onOpenChange, navItems, dashboardHref }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { tutors, blogs, loading } = useGlobalSearch(query);
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (href: string) => {
    onOpenChange(false);
    setTimeout(() => navigate(href), 50);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={true}>
        <CommandInput
          placeholder="Search pages, tutors, blog posts, actions…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>
            {loading ? "Searching…" : "No results found."}
          </CommandEmpty>

          <CommandGroup heading="Workspace">
            {navItems.map((it) => (
              <CommandItem
                key={`nav-${it.href}`}
                value={`nav ${it.label}`}
                onSelect={() => go(it.href)}
                className="gap-3"
              >
                <it.icon className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1">{it.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Pages">
            {PUBLIC_PAGES.map((it) => (
              <CommandItem
                key={`page-${it.href}-${it.label}`}
                value={`page ${it.label}`}
                onSelect={() => go(it.href)}
                className="gap-3"
              >
                <it.icon className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1">{it.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              </CommandItem>
            ))}
          </CommandGroup>

          {tutors.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Tutors">
                {tutors.map((t) => (
                  <CommandItem
                    key={`tutor-${t.id}`}
                    value={`tutor ${t.name} ${t.category || ""}`}
                    onSelect={() => go(`/tutors/${t.id}`)}
                    className="gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                      {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      {t.category && <p className="text-[11px] text-muted-foreground truncate">{t.category}</p>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {blogs.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Blog Posts">
                {blogs.map((b) => (
                  <CommandItem
                    key={`blog-${b.id}`}
                    value={`blog ${b.title}`}
                    onSelect={() => go(`/blog/${b.slug}`)}
                    className="gap-3"
                  >
                    <Newspaper className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{b.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            <CommandItem value="action profile" onSelect={() => go(`${dashboardHref}/profile`)} className="gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Go to Profile</span>
            </CommandItem>
            <CommandItem value="action settings" onSelect={() => go(`${dashboardHref}/settings`)} className="gap-3">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Open Settings</span>
            </CommandItem>
            <CommandItem
              value="action theme toggle"
              onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="gap-3"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>Toggle theme ({theme === "dark" ? "Light" : "Dark"})</span>
            </CommandItem>
            <CommandItem
              value="action explore tutors"
              onSelect={() => go("/tutors")}
              className="gap-3"
            >
              <Compass className="w-4 h-4 text-muted-foreground" />
              <span>Explore tutors</span>
              <Sparkles className="w-3 h-3 text-primary ml-auto" />
            </CommandItem>
            <CommandItem
              value="action sign out"
              onSelect={async () => {
                onOpenChange(false);
                await signOut();
                navigate("/");
              }}
              className="gap-3 text-destructive aria-selected:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
