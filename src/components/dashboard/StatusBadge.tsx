interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const colorMap: Record<string, string> = {
  confirmed: "bg-accent/10 text-accent border-accent/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  active: "bg-accent/10 text-accent border-accent/20",
  inactive: "bg-muted text-muted-foreground border-border",
  banned: "bg-destructive/10 text-destructive border-destructive/20",
  approved: "bg-accent/10 text-accent border-accent/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  investigating: "bg-warning/10 text-warning border-warning/20",
  escalated: "bg-destructive/10 text-destructive border-destructive/20",
  resolved: "bg-accent/10 text-accent border-accent/20",
  success: "bg-accent/10 text-accent border-accent/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  draft: "bg-muted text-muted-foreground border-border",
  published: "bg-accent/10 text-accent border-accent/20",
  archived: "bg-muted text-muted-foreground border-border",
  // Roles
  student: "bg-info/10 text-info border-info/20",
  tutor: "bg-primary/10 text-primary border-primary/20",
  moderator: "bg-warning/10 text-warning border-warning/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  // Priority
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const colors = colorMap[key] || "bg-muted text-muted-foreground border-border";
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`font-semibold rounded-full border capitalize inline-block ${colors} ${sizeClass}`}>
      {status}
    </span>
  );
}
