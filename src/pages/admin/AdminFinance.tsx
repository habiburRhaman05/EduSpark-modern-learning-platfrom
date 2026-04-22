import { useSearchParams } from "react-router-dom";
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPayments, useAdminStats } from "@/hooks/useAdmin";

export default function AdminFinance() {
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

  const { data, isLoading } = useAdminPayments({ page, pageSize: 10, status, search });
  const { data: stats } = useAdminStats();

  const columns = [
    { key: "ref", header: "Reference", render: (p: any) => <span className="font-mono text-[10px] text-muted-foreground">{p.transaction_ref || p.id.slice(0, 8)}</span> },
    { key: "from", header: "From", render: (p: any) => <span className="text-foreground">{p.payer_name}</span> },
    { key: "to", header: "To", render: (p: any) => <span className="text-muted-foreground">{p.payee_name}</span> },
    { key: "amount", header: "Amount", render: (p: any) => <span className="text-foreground font-bold">${Number(p.amount || 0).toFixed(2)}</span> },
    { key: "fee", header: "Fee", render: (p: any) => <span className="text-muted-foreground text-xs">${Number(p.platform_fee || 0).toFixed(2)}</span> },
    { key: "method", header: "Method", render: (p: any) => <span className="text-muted-foreground capitalize">{p.method || "—"}</span> },
    { key: "date", header: "Date", render: (p: any) => <span className="text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (p: any) => <StatusBadge status={p.status || "pending"} size="md" /> },
  ];

  return (
    <>
      <PageHeader title="Finance & Transactions" description="All platform payments" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats ? (
          <>
            <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(0)}`} icon={DollarSign} positive />
            <StatCard label="Platform Fees" value={`$${stats.totalFees.toFixed(0)}`} icon={TrendingUp} positive />
            <StatCard label="Transactions" value={String(data?.total || 0)} icon={CreditCard} />
            <StatCard label="Pending Verifs" value={String(stats.pendingVerifications)} icon={AlertCircle} />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        )}
      </div>

      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => setParam("q", v)}
          searchPlaceholder="Search by reference…"
          filters={[{
            label: "All Status",
            value: "status",
            options: [
              { label: "Completed", value: "completed" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
              { label: "Refunded", value: "refunded" },
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
            keyExtractor={(p: any) => p.id}
            page={page}
            totalPages={data?.totalPages || 1}
            onPageChange={(p) => setParam("page", p)}
            emptyTitle="No transactions yet"
          />
        )}
      </div>
    </>
  );
}
