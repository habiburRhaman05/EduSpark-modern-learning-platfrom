import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { verificationDocs } from "@/lib/mock-data";
import { toast } from "sonner";
import { Check, X, FileText } from "lucide-react";

export default function ModeratorVerification() {
  const columns = [
    { key: "tutor", header: "Tutor", render: (d: typeof verificationDocs[0]) => <span className="text-foreground font-medium">{d.tutorName}</span> },
    { key: "type", header: "Document", render: (d: typeof verificationDocs[0]) => (
      <div className="flex items-center gap-1"><FileText className="w-3 h-3 text-primary" /><span className="text-muted-foreground text-xs">{d.documentType}</span></div>
    )},
    { key: "file", header: "File", render: (d: typeof verificationDocs[0]) => <span className="text-muted-foreground text-xs">{d.fileName}</span> },
    { key: "submitted", header: "Submitted", render: (d: typeof verificationDocs[0]) => <span className="text-muted-foreground">{d.submittedAt}</span> },
    { key: "status", header: "Status", render: (d: typeof verificationDocs[0]) => <StatusBadge status={d.status} size="md" /> },
    { key: "actions", header: "", render: (d: typeof verificationDocs[0]) => d.status === "pending" ? (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 text-xs text-accent" onClick={() => toast.success("Approved")}><Check className="w-3 h-3" /></Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => toast.success("Rejected")}><X className="w-3 h-3" /></Button>
      </div>
    ) : null },
  ];

  return (
    <>
      <PageHeader title="Verification Assistance" description="Review tutor verification documents" />
      <div className="bento-card">
        <DataTable columns={columns} data={verificationDocs} keyExtractor={(d) => d.id} emptyTitle="No pending verifications" />
      </div>
    </>
  );
}
