import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Circle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Props {
  open: boolean;
  onClose: () => void;
  onSkip: () => void;
  missing: { key: string; label: string; ok: boolean }[];
  percent: number;
}

export function OnboardingDialog({ open, onClose, onSkip, missing, percent }: Props) {
  const navigate = useNavigate();

  const handleStart = () => {
    onClose();
    navigate("/tutor/profile");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onSkip()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border-border/60">
        <div className="relative bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 pb-4">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 mb-4"
          >
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </motion.div>
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl font-black">Complete your tutor profile</DialogTitle>
            <DialogDescription className="text-sm">
              Students can't book a tutor with an incomplete profile. Finish setup to start earning.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-medium">Profile completion</span>
              <span className="text-primary font-black">{percent}%</span>
            </div>
            <Progress value={percent} className="h-2" />
          </div>
        </div>

        <div className="p-6 pt-2 space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {missing.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors"
              >
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${item.ok ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="px-6 pb-6 flex items-center gap-2">
          <Button variant="ghost" onClick={onSkip} className="flex-1 rounded-xl text-muted-foreground hover:text-foreground">
            Skip for now
          </Button>
          <Button onClick={handleStart} className="flex-1 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            Complete profile
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
