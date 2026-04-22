import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { useTutorOnboarding } from "./TutorOnboardingProvider";

/**
 * Sticky red alert banner shown under header when tutor profile is incomplete.
 * Hidden on the profile page itself.
 */
export function OnboardingAlertBanner() {
  const { isComplete, percent, missing } = useTutorOnboarding();
  const location = useLocation();
  const [hidden, setHidden] = useState(false);

  if (isComplete || hidden) return null;
  if (location.pathname.includes("/profile")) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent p-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">
              Your profile is {percent}% complete
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {missing.length} item{missing.length === 1 ? "" : "s"} left:{" "}
              <span className="text-foreground font-medium">{missing.slice(0, 3).map((m) => m.label).join(", ")}</span>
              {missing.length > 3 && " …"}
            </p>
            {/* Inline progress */}
            <div className="mt-2 h-1.5 rounded-full bg-destructive/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-destructive to-destructive/70 rounded-full"
              />
            </div>
          </div>
          <Link
            to="/tutor/profile"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-destructive hover:text-destructive/80 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors"
          >
            Complete now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setHidden(true)}
            className="w-7 h-7 rounded-lg hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Hide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
