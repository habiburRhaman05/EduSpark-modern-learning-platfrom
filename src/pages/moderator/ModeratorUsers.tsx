import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { reportedUsers } from "@/lib/mock-data";
import { toast } from "sonner";
import { Ban, AlertTriangle } from "lucide-react";

export default function ModeratorUsers() {
  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string } | null>(null);

  const filtered = reportedUsers.filter((r) => r.reportedUserName.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: "user", header: "Reported User", render: (r: typeof reportedUsers[0]) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center text-[10px] font-bold text-destructive">{r.reportedUserName[0]}</div>
        <span className="text-foreground font-medium">{r.reportedUserName}</span>
      </div>
    )},
    { key: "reason", header: "Reason", render: (r: typeof reportedUsers[0]) => <span className="text-muted-foreground text-xs">{r.reason}</span> },
    { key: "reportedBy", header: "Reported By", render: (r: typeof reportedUsers[0]) => <span className="text-muted-foreground">{r.reportedByName}</span> },
    { key: "priority", header: "Priority", render: (r: typeof reportedUsers[0]) => <StatusBadge status={r.priority} size="md" /> },
    { key: "status", header: "Status", render: (r: typeof reportedUsers[0]) => <StatusBadge status={r.status} size="md" /> },
    { key: "actions", header: "", render: (r: typeof reportedUsers[0]) => r.status === "pending" ? (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 text-xs text-warning" onClick={() => setConfirmAction({ id: r.id, action: "warn" })}><AlertTriangle className="w-3 h-3 mr-1" />Warn</Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => setConfirmAction({ id: r.id, action: "ban" })}><Ban className="w-3 h-3 mr-1" />Ban</Button>
      </div>
    ) : null },
  ];

  return (
    <>
      <PageHeader title="User Moderation" description="Review and manage reported users" />
      <div className="bento-card">
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search users..." />
        <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyTitle="No reports" />
      </div>
      <ConfirmDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)} title={confirmAction?.action === "ban" ? "Ban User" : "Warn User"} description={`Are you sure you want to ${confirmAction?.action} this user?`} confirmLabel={confirmAction?.action === "ban" ? "Ban User" : "Send Warning"} onConfirm={() => { toast.success(`User ${confirmAction?.action}ned`); setConfirmAction(null); }} destructive={confirmAction?.action === "ban"} />
    </>
  );
}
