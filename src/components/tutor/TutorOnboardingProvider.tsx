import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboardingStatus } from "@/hooks/useTutorProfile";
import { OnboardingDialog } from "./OnboardingDialog";

interface Ctx {
  open: () => void;
  dismissedThisSession: boolean;
  percent: number;
  isComplete: boolean;
  missing: { key: string; label: string; ok: boolean }[];
}
const TutorOnboardingCtx = createContext<Ctx | null>(null);

export function useTutorOnboarding() {
  const ctx = useContext(TutorOnboardingCtx);
  if (!ctx) throw new Error("useTutorOnboarding must be used within TutorOnboardingProvider");
  return ctx;
}

export function TutorOnboardingProvider({ children }: { children: ReactNode }) {
  const { role, user } = useAuth();
  const { isComplete, percent, missing, isLoading } = useOnboardingStatus();
  const location = useLocation();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("tutor-onboarding-dismissed") === "1";
  });
  const [open, setOpen] = useState(false);

  // Auto-show when entering tutor dashboard for the first time per session
  useEffect(() => {
    if (role !== "tutor" || isLoading) return;
    if (!user) return;
    if (isComplete) return;
    if (dismissed) return;
    if (!location.pathname.startsWith("/tutor")) return;
    // Don't open if user is already on the profile/verification page
    if (location.pathname.includes("/profile") || location.pathname.includes("/verification")) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [role, user, isLoading, isComplete, dismissed, location.pathname]);

  const handleDismiss = () => {
    sessionStorage.setItem("tutor-onboarding-dismissed", "1");
    setDismissed(true);
    setOpen(false);
  };

  return (
    <TutorOnboardingCtx.Provider
      value={{
        open: () => setOpen(true),
        dismissedThisSession: dismissed,
        percent,
        isComplete,
        missing,
      }}
    >
      {children}
      {role === "tutor" && (
        <OnboardingDialog
          open={open}
          onSkip={handleDismiss}
          onClose={() => setOpen(false)}
          missing={missing}
          percent={percent}
        />
      )}
    </TutorOnboardingCtx.Provider>
  );
}
