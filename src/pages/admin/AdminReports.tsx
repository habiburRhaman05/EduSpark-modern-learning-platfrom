import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { auditLogs } from "@/lib/mock-data";

export default function AdminReports() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const filtered = auditLogs.filter((l) => {
    const ms = l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase());
    const mf = !severityFilter || l.severity === severityFilter;
    return ms && mf;
  });

  const columns = [
    { key: "time", header: "Time", render: (l: typeof auditLogs[0]) => <span className="text-xs text-muted-foreground">{l.createdAt}</span> },
    { key: "action", header: "Action", render: (l: typeof auditLogs[0]) => <span className="font-mono text-xs text-foreground">{l.action}</span> },
    { key: "actor", header: "Actor", render: (l: typeof auditLogs[0]) => <span className="text-muted-foreground">{l.actor}</span> },
    { key: "target", header: "Target", render: (l: typeof auditLogs[0]) => <span className="text-muted-foreground text-xs">{l.target}</span> },
    { key: "details", header: "Details", render: (l: typeof auditLogs[0]) => <span className="text-muted-foreground text-xs max-w-[200px] truncate block">{l.details}</span> },
    { key: "severity", header: "Severity", render: (l: typeof auditLogs[0]) => <StatusBadge status={l.severity} size="md" /> },
  ];

  return (
    <>
      <PageHeader title="Reports & Audit Logs" description="System activity and security logs" />
      <div className="bento-card">
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search logs..."
          filters={[{ label: "All Severity", value: "severity", options: [{ label: "Info", value: "info" }, { label: "Warning", value: "warning" }, { label: "Critical", value: "critical" }] }]}
          filterValues={{ severity: severityFilter }} onFilterChange={(_, v) => setSeverityFilter(v)} />
        <DataTable columns={columns} data={filtered} keyExtractor={(l) => l.id} />
      </div>
    </>
  );
}
