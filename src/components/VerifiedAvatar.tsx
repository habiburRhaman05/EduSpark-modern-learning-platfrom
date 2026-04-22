import { ShieldCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "approved" | "pending" | "rejected" | null | undefined;

interface Props {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: Status;
  isVerified?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: "w-10 h-10", text: "text-xs", badge: "w-3.5 h-3.5", badgePos: "-bottom-0.5 -right-0.5", icon: "w-2 h-2" },
  md: { box: "w-14 h-14", text: "text-sm", badge: "w-5 h-5", badgePos: "-bottom-0.5 -right-0.5", icon: "w-3 h-3" },
  lg: { box: "w-20 h-20", text: "text-lg", badge: "w-6 h-6", badgePos: "bottom-0 right-0", icon: "w-3.5 h-3.5" },
  xl: { box: "w-28 h-28", text: "text-2xl", badge: "w-8 h-8", badgePos: "bottom-1 right-1", icon: "w-4 h-4" },
};

/**
 * Avatar with dynamic verification ring + badge.
 * - approved => primary glow ring + verified badge
 * - pending  => warning dashed ring + clock badge
 * - rejected/none => neutral ring
 */
export function VerifiedAvatar({ src, name, size = "md", status, isVerified, className }: Props) {
  const s = SIZE_MAP[size];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const verified = isVerified || status === "approved";
  const pending = !verified && status === "pending";

  const ringClass = verified
    ? "ring-2 ring-primary/60 shadow-lg shadow-primary/20"
    : pending
    ? "ring-2 ring-warning/40 ring-dashed"
    : "ring-1 ring-border";

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn(
          s.box,
          "rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center font-black text-primary overflow-hidden transition-all",
          s.text,
          ringClass
        )}
      >
        {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
      </div>
      {verified && (
        <div
          className={cn(
            "absolute rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md ring-2 ring-background",
            s.badge,
            s.badgePos
          )}
          title="Verified tutor"
        >
          <ShieldCheck className={s.icon} />
        </div>
      )}
      {pending && (
        <div
          className={cn(
            "absolute rounded-full bg-warning text-white flex items-center justify-center shadow-md ring-2 ring-background",
            s.badge,
            s.badgePos
          )}
          title="Verification pending"
        >
          <Clock className={s.icon} />
        </div>
      )}
    </div>
  );
}
