import { useState } from "react";
import { Wallet, Check, X, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useAdminWithdrawals, useProcessWithdrawal } from "@/hooks/useAdminWithdrawals";
import { toast } from "sonner";

export default function AdminWithdrawals() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const { data, isLoading } = useAdminWithdrawals({ status });
  const process = useProcessWithdrawal();
  const [reject, setReject] = useState<any | null>(null);
  const [reason, setReason] = useState("");

  const setStatus = (s: string) => {
    const next = new URLSearchParams(params);
    if (!s) next.delete("status"); else next.set("status", s);
    setParams(next, { replace: true });
  };

  const list = data || [];
  const totals = {
    pending: list.filter((w: any) => w.status === "pending").reduce((s: number, w: any) => s + Number(w.amount), 0),
    approved: list.filter((w: any) => w.status === "approved").reduce((s: number, w: any) => s + Number(w.amount), 0),
    count: list.length,
  };

  const approve = async (w: any) => {
    try {
      await process.mutateAsync({ id: w.id, approve: true });
      toast.success(`Approved $${Number(w.amount).toFixed(2)} for ${w.tutor?.full_name || "tutor"}`);
    } catch (e: any) { toast.error(e.message || "Failed"); }
  };

  const confirmReject = async () => {
    if (!reject) return;
    if (!reason.trim()) return toast.error("Reason required");
    try {
      await process.mutateAsync({ id: reject.id, approve: false, reason });
      toast.success("Rejected and refunded");
      setReject(null); setReason("");
    } catch (e: any) { toast.error(e.message || "Failed"); }
  };

  const columns = [
    { key: "id", header: "Ref", render: (w: any) => <span className="font-mono text-[10px] text-muted-foreground">{w.id.slice(0, 8)}</span> },
    { key: "tutor", header: "Tutor", render: (w: any) => (
      <div>
        <p className="text-sm font-semibold text-foreground">{w.tutor?.full_name || "—"}</p>
        <p className="text-xs text-muted-foreground">{w.tutor?.email}</p>
      </div>
    )},
    { key: "amount", header: "Amount", render: (w: any) => <span className="text-foreground font-bold">${Number(w.amount).toFixed(2)}</span> },
    { key: "bank", header: "Bank", render: (w: any) => <span className="text-muted-foreground text-xs">{w.bank_name} •••{(w.account_number||"").slice(-4)}</span> },
    { key: "date", header: "Requested", render: (w: any) => <span className="text-muted-foreground text-xs">{new Date(w.created_at).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (w: any) => <StatusBadge status={w.status} size="md" /> },
    { key: "actions", header: "", render: (w: any) => w.status === "pending" ? (
      <div className="flex gap-1.5">
        <Button size="sm" variant="ghost" className="h-8 text-xs text-success" onClick={() => approve(w)} disabled={process.isPending}>
          <Check className="w-3 h-3 mr-1" /> Approve
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive" onClick={() => { setReject(w); setReason(""); }} disabled={process.isPending}>
          <X className="w-3 h-3 mr-1" /> Reject
        </Button>
      </div>
    ) : null },
  ];

  return (
    <>
      <PageHeader title="Tutor Withdrawals" description="Approve or reject tutor payout requests" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending Total" value={`$${totals.pending.toFixed(2)}`} icon={Wallet} />
        <StatCard label="Approved Total" value={`$${totals.approved.toFixed(2)}`} positive />
        <StatCard label="All Requests" value={String(totals.count)} />
      </div>

      <div className="bento-card">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {[
            { l: "All", v: "" }, { l: "Pending", v: "pending" }, { l: "Approved", v: "approved" }, { l: "Rejected", v: "rejected" },
          ].map(t => (
            <Button key={t.v} size="sm" variant={status === t.v ? "default" : "outline"} className="h-8 rounded-xl" onClick={() => setStatus(t.v)}>
              {t.l}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <div className="space-y-2">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-12 rounded-xl"/>)}</div>
        ) : (
          <DataTable
            columns={columns}
            data={list}
            keyExtractor={(w: any) => w.id}
            emptyTitle="No withdrawal requests"
          />
        )}
      </div>

      <Dialog open={!!reject} onOpenChange={(o) => { if (!o) { setReject(null); setReason(""); } }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reject withdrawal</DialogTitle>
            <DialogDescription>
              The tutor's balance will be refunded and they will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (will be shown to the tutor)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-xl min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReject(null)}>Cancel</Button>
            <Button onClick={confirmReject} disabled={process.isPending} className="bg-destructive hover:bg-destructive/90 rounded-xl">
              {process.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
              Reject & refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
