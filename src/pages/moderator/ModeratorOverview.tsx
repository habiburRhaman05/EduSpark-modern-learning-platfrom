import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { moderatorStats, issues, reportedUsers, flaggedContent } from "@/lib/mock-data";
import { Shield, Users, AlertTriangle, Ticket } from "lucide-react";

export default function ModeratorOverview() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {moderatorStats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} change={s.change} positive={s.positive} icon={i === 0 ? Ticket : i === 1 ? Shield : i === 2 ? AlertTriangle : Users} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {reportedUsers.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.reportedUserName}</p>
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                </div>
                <StatusBadge status={r.priority} size="md" />
              </div>
            ))}
          </div>
        </div>
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Flagged Content</h3>
          <div className="space-y-3">
            {flaggedContent.slice(0, 3).map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.userName}</p>
                  <p className="text-xs text-muted-foreground">{f.reason}</p>
                </div>
                <StatusBadge status={f.status} size="md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
