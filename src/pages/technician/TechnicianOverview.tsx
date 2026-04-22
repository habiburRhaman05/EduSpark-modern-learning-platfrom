import { StatCard } from "@/components/dashboard/StatCard";
import { AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import { issues } from "@/lib/mock-data";

export default function TechnicianOverview() {
  const pending = issues.filter(i => i.status === "PENDING" && i.type === "ISSUE").length;
  const resolved = issues.filter(i => i.status === "SUCCESS").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Issues" value={String(pending)} change="-2" positive icon={AlertTriangle} />
        <StatCard label="Resolved" value={String(resolved)} change="+5" positive icon={CheckCircle} />
        <StatCard label="Avg Resolution" value="2.4h" change="-0.5h" positive icon={Clock} />
        <StatCard label="System Health" value="99.2%" change="+0.1%" positive icon={Wrench} />
      </div>

      <div className="bento-card">
        <h3 className="font-semibold text-foreground mb-4">Recent Technical Issues</h3>
        <div className="space-y-3">
          {issues.filter(i => i.type === "ISSUE").slice(0, 5).map(issue => (
            <div key={issue.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{issue.title}</p>
                <p className="text-xs text-muted-foreground">{issue.createdAt} • {issue.username}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${issue.status === "PENDING" ? "bg-warning/20 text-warning" : "bg-accent/20 text-accent"}`}>
                {issue.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
