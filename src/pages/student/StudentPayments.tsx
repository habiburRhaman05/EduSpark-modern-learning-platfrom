import { useSearchParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { useStudentPayments, useStudentPaymentStats } from "@/hooks/usePayments";

export default function StudentPayments() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const search = params.get("q") || "";
  const page = Number(params.get("page") || 1);

  const setParam = (k: string, v: string | number) => {
    const next = new URLSearchParams(params);
    if (!v) next.delete(k); else next.set(k, String(v));
    if (k !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const { data, isLoading } = useStudentPayments({ status, search, page, pageSize: 8 });
  const { data: stats, isLoading: statsLoading } = useStudentPaymentStats();

  const columns = [
    { key: "tx", header: "Transaction Ref", render: (p: any) => <span className="font-mono text-xs text-muted-foreground">{p.transaction_ref || p.id.slice(0,8)}</span> },
    { key: "booking", header: "Booking", render: (p: any) => <span className="text-foreground font-medium font-mono text-xs">{p.booking_id ? p.booking_id.slice(0,8) : "—"}</span> },
    { key: "amount", header: "Amount", render: (p: any) => <span className="text-foreground font-bold">${Number(p.amount).toFixed(2)}</span> },
    { key: "method", header: "Method", render: (p: any) => <span className="text-muted-foreground capitalize">{p.method}</span> },
    { key: "date", header: "Date", render: (p: any) => <span className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (p: any) => <StatusBadge status={p.status} size="md" /> },
  ];

  return (
    <>
      <PageHeader title="Payment History" description="Track all your payments and invoices" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading || !stats ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Total Paid" value={`$${stats.totalPaid.toFixed(0)}`} icon={CreditCard} />
            <StatCard label="Transactions" value={String(stats.count)} />
            <StatCard label="Successful" value={String(stats.successful)} positive />
            <StatCard label="Pending" value={String(stats.pending)} />
          </>
        )}
      </div>

      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => setParam("q", v)}
          searchPlaceholder="Search by transaction ref..."
          filters={[{ label: "All Status", value: "status", options: [
            { label: "Completed", value: "completed" },
            { label: "Pending", value: "pending" },
            { label: "Refunded", value: "refunded" },
            { label: "Failed", value: "failed" },
          ]}]}
          filterValues={{ status }}
          onFilterChange={(_, v) => setParam("status", v)}
        />
        {isLoading ? (
          <div className="space-y-2 mt-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <DataTable columns={columns} data={data?.items || []} keyExtractor={(p: any) => p.id} page={page} totalPages={data?.totalPages || 1} onPageChange={(p) => setParam("page", p)} emptyTitle="No payments found" />
        )}
      </div>
    </>
  );
}
