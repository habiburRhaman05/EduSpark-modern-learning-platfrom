import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBookings } from "@/hooks/useAdmin";

export default function AdminBookings() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const status = params.get("status") || "";
  const page = Number(params.get("page") || 1);

  const setParam = (k: string, v: string | number) => {
    const next = new URLSearchParams(params);
    if (!v && v !== 0) next.delete(k);
    else next.set(k, String(v));
    if (k !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const { data, isLoading } = useAdminBookings({ page, pageSize: 10, status, search });

  const columns = [
    { key: "id", header: "Ref", render: (b: any) => <span className="font-mono text-[10px] text-muted-foreground">{b.id.slice(0, 8)}</span> },
    { key: "student", header: "Student", render: (b: any) => <span className="text-foreground">{b.student_name}</span> },
    { key: "tutor", header: "Tutor", render: (b: any) => <span className="text-muted-foreground">{b.tutor_name}</span> },
    { key: "subject", header: "Subject", render: (b: any) => <span className="text-muted-foreground">{b.subject}</span> },
    { key: "scheduled", header: "Scheduled", render: (b: any) => <span className="text-muted-foreground text-xs">{new Date(b.scheduled_at).toLocaleString()}</span> },
    { key: "amount", header: "Amount", render: (b: any) => <span className="text-foreground font-bold">${Number(b.amount || 0).toFixed(0)}</span> },
    { key: "status", header: "Status", render: (b: any) => <StatusBadge status={b.status || "pending"} size="md" /> },
    { key: "pay", header: "Payment", render: (b: any) => <StatusBadge status={b.payment_status || "pending"} size="md" /> },
  ];

  return (
    <>
      <PageHeader title="All Bookings" description={isLoading ? "Loading…" : `${data?.total || 0} bookings`} />
      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => setParam("q", v)}
          searchPlaceholder="Search by subject…"
          filters={[{
            label: "All Status",
            value: "status",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          }]}
          filterValues={{ status }}
          onFilterChange={(_, v) => setParam("status", v)}
        />
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.items || []}
            keyExtractor={(b: any) => b.id}
            page={page}
            totalPages={data?.totalPages || 1}
            onPageChange={(p) => setParam("page", p)}
            emptyTitle="No bookings yet"
          />
        )}
      </div>
    </>
  );
}
