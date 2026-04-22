import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function ChartCard({ title, subtitle, children, className = "", actions }: ChartCardProps) {
  return (
    <div className={`bento-card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
