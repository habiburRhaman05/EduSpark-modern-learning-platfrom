import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { flaggedContent } from "@/lib/mock-data";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function ModeratorContent() {
  const [search, setSearch] = useState("");
  const filtered = flaggedContent.filter((f) => f.userName.toLowerCase().includes(search.toLowerCase()) || f.content.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: "user", header: "User", render: (f: typeof flaggedContent[0]) => <span className="text-foreground font-medium">{f.userName}</span> },
    { key: "type", header: "Type", render: (f: typeof flaggedContent[0]) => <StatusBadge status={f.type} size="md" /> },
    { key: "content", header: "Content", render: (f: typeof flaggedContent[0]) => <span className="text-muted-foreground text-xs max-w-[200px] truncate block">{f.content}</span> },
    { key: "reason", header: "Reason", render: (f: typeof flaggedContent[0]) => <span className="text-muted-foreground text-xs">{f.reason}</span> },
    { key: "status", header: "Status", render: (f: typeof flaggedContent[0]) => <StatusBadge status={f.status} size="md" /> },
    { key: "actions", header: "", render: (f: typeof flaggedContent[0]) => f.status === "pending" ? (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 text-xs text-accent" onClick={() => toast.success("Content approved")}><Check className="w-3 h-3 mr-1" />Approve</Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => toast.success("Content rejected")}><X className="w-3 h-3 mr-1" />Reject</Button>
      </div>
    ) : null },
  ];

  return (
    <>
      <PageHeader title="Content Moderation" description="Review flagged content" />
      <div className="bento-card">
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search content..." />
        <DataTable columns={columns} data={filtered} keyExtractor={(f) => f.id} emptyTitle="No flagged content" />
      </div>
    </>
  );
}
