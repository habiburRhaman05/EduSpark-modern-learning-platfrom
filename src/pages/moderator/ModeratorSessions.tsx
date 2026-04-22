import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { sessionComplaints } from "@/lib/mock-data";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

export default function ModeratorSessions() {
  const columns = [
    { key: "session", header: "Session", render: (s: typeof sessionComplaints[0]) => <span className="font-mono text-xs text-muted-foreground">{s.sessionId}</span> },
    { key: "student", header: "Student", render: (s: typeof sessionComplaints[0]) => <span className="text-foreground">{s.studentName}</span> },
    { key: "tutor", header: "Tutor", render: (s: typeof sessionComplaints[0]) => <span className="text-muted-foreground">{s.tutorName}</span> },
    { key: "reason", header: "Reason", render: (s: typeof sessionComplaints[0]) => <span className="text-muted-foreground text-xs">{s.reason}</span> },
    { key: "priority", header: "Priority", render: (s: typeof sessionComplaints[0]) => <StatusBadge status={s.priority} size="md" /> },
    { key: "status", header: "Status", render: (s: typeof sessionComplaints[0]) => <StatusBadge status={s.status} size="md" /> },
    { key: "actions", header: "", render: (s: typeof sessionComplaints[0]) => s.status !== "escalated" ? (
      <Button size="sm" variant="ghost" className="h-7 text-xs text-warning" onClick={() => toast.success("Escalated to admin")}><ArrowUpRight className="w-3 h-3 mr-1" />Escalate</Button>
    ) : null },
  ];

  return (
    <>
      <PageHeader title="Session Monitoring" description="Investigate session reports and complaints" />
      <div className="bento-card">
        <DataTable columns={columns} data={sessionComplaints} keyExtractor={(s) => s.id} emptyTitle="No complaints" />
      </div>
    </>
  );
}
