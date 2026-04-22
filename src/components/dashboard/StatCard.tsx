import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: LucideIcon;
}

export function StatCard({ label, value, change, positive, icon: Icon }: StatCardProps) {
  return (
    <div className="bento-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-black text-foreground">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-1 ${positive ? "text-accent" : "text-destructive"}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
