import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Video, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useState } from "react";
import { useStudentBookings, useCancelBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

export default function StudentSessions() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const search = params.get("q") || "";
  const page = Number(params.get("page") || 1);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const setParam = (k: string, v: string | number) => {
    const next = new URLSearchParams(params);
    if (!v) next.delete(k); else next.set(k, String(v));
    if (k !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const { data, isLoading } = useStudentBookings({ status, search, page, pageSize: 8 });
  const cancel = useCancelBooking();

  const columns = [
    { key: "id", header: "ID", render: (b: any) => <span className="font-mono text-xs text-muted-foreground">{b.id.slice(0, 8)}</span> },
    { key: "subject", header: "Subject", render: (b: any) => <Link to={`/dashboard/sessions/${b.id}`} className="text-foreground font-medium hover:text-primary">{b.subject}</Link> },
    { key: "tutor", header: "Tutor", render: (b: any) => <span className="text-muted-foreground">{b.tutor?.full_name || "—"}</span> },
    { key: "date", header: "Date & Time", render: (b: any) => <span className="text-muted-foreground">{new Date(b.scheduled_at).toLocaleString()}</span> },
    { key: "duration", header: "Duration", render: (b: any) => <span className="text-muted-foreground">{b.duration_minutes || 60} min</span> },
    { key: "amount", header: "Amount", render: (b: any) => <span className="text-foreground font-medium">${Number(b.amount || 0)}</span> },
    { key: "status", header: "Status", render: (b: any) => <StatusBadge status={b.status} size="md" /> },
    {
      key: "actions", header: "Actions", render: (b: any) => (
        <div className="flex gap-1">
          {b.status === "confirmed" && (
            <Link to={`/session/${b.id}/call`}>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:text-primary"><Video className="w-3 h-3 mr-1" />Join</Button>
            </Link>
          )}
          {(b.status === "confirmed" || b.status === "pending") && (
            <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => setCancelId(b.id)}><XIcon className="w-3 h-3" /></Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My Sessions" description="View and manage all your booked sessions" />

      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => setParam("q", v)}
          searchPlaceholder="Search sessions by subject..."
          filters={[{ label: "All Status", value: "status", options: [
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}]}
          filterValues={{ status }}
          onFilterChange={(_, v) => setParam("status", v)}
        />
        {isLoading ? (
          <div className="space-y-2 mt-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <DataTable columns={columns} data={data?.items || []} keyExtractor={(b: any) => b.id} page={page} totalPages={data?.totalPages || 1} onPageChange={(p) => setParam("page", p)} emptyTitle="No sessions found" emptyDescription="Book a session with a tutor to get started" />
        )}
      </div>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={() => setCancelId(null)}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? This action cannot be undone."
        confirmLabel="Cancel Session"
        onConfirm={() => {
          cancel.mutate(cancelId!, {
            onSuccess: () => { toast.success("Session cancelled"); setCancelId(null); },
            onError: () => toast.error("Failed to cancel"),
          });
        }}
        destructive
      />
    </>
  );
}
