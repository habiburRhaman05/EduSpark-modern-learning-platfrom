import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.div>
    </button>
  );
}
