import { Link, useSearchParams } from "react-router-dom";
import { Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutorBookings, useUpdateBookingStatus } from "@/hooks/useTutorBookings";
import { toast } from "sonner";

export default function TutorSessions() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const search = params.get("q") || "";
  const page = Number(params.get("page") || 1);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key); else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
  };

  const { data, isLoading } = useTutorBookings({ status, search, page, pageSize: 8 });
  const updateStatus = useUpdateBookingStatus();

  const initials = (name?: string) => (name || "S").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const columns = [
    { key: "id", header: "ID", render: (b: any) => <span className="font-mono text-xs text-muted-foreground">{b.id.slice(0, 8)}</span> },
    {
      key: "student", header: "Student", render: (b: any) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
            {b.student?.avatar_url ? <img src={b.student.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(b.student?.full_name)}
          </div>
          <span className="text-foreground font-medium">{b.student?.full_name || "Student"}</span>
        </div>
      ),
    },
    { key: "subject", header: "Subject", render: (b: any) => <span className="text-muted-foreground">{b.subject}</span> },
    { key: "date", header: "Scheduled", render: (b: any) => <span className="text-muted-foreground">{new Date(b.scheduled_at).toLocaleString()}</span> },
    { key: "amount", header: "Amount", render: (b: any) => <span className="text-foreground font-bold">${Number(b.amount || 0).toFixed(0)}</span> },
    { key: "status", header: "Status", render: (b: any) => <StatusBadge status={b.status || "pending"} size="md" /> },
    {
      key: "actions", header: "", render: (b: any) => (
        <div className="flex gap-1">
          {b.status === "confirmed" && (
            <>
              <Link to={`/session/${b.id}/call`}>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary"><Video className="w-3 h-3 mr-1" />Start</Button>
              </Link>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-accent"
                onClick={() => updateStatus.mutate({ id: b.id, status: "completed" }, { onSuccess: () => toast.success("Marked completed") })}>
                <Check className="w-3 h-3 mr-1" />Complete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My Sessions" description="All your bookings, filtered by status" />
      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => setParam("q", v)}
          searchPlaceholder="Search by subject..."
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
          <div className="space-y-2 mt-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.items || []}
            keyExtractor={(b: any) => b.id}
            page={page}
            totalPages={data?.totalPages || 1}
            onPageChange={(p) => setParam("page", String(p))}
            emptyTitle="No sessions yet"
          />
        )}
      </div>
    </>
  );
}
