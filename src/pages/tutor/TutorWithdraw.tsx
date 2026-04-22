import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Loader2, Plus, Building2, Hash, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataTable } from "@/components/dashboard/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutorEarnings } from "@/hooks/useTutorEarnings";
import { useMyWithdrawals, useRequestWithdrawal } from "@/hooks/useTutorWithdrawals";
import { toast } from "sonner";

const schema = z.object({
  amount: z.coerce.number().min(50, "Minimum is $50").max(100000),
  bank_name: z.string().trim().min(2, "Required").max(100),
  account_number: z.string().trim().min(4, "Required").max(40),
  routing_number: z.string().trim().max(40).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function TutorWithdraw() {
  const { data: earnings, isLoading: earningsLoading } = useTutorEarnings();
  const { data: withdrawals, isLoading: withdrawalsLoading } = useMyWithdrawals();
  const request = useRequestWithdrawal();

  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<any | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { amount: 50, bank_name: "", account_number: "", routing_number: "" },
  });

  const onSubmit = async (v: FormValues) => {
    try {
      await request.mutateAsync({
        amount: v.amount,
        bank_name: v.bank_name,
        account_number: v.account_number,
        routing_number: v.routing_number || undefined,
      });
      toast.success(`Withdrawal of $${v.amount} requested`);
      setOpen(false);
      form.reset();
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  const available = Number(earnings?.availableBalance || 0);
  const pendingTotal = (withdrawals || []).filter((w: any) => w.status === "pending").reduce((s: number, w: any) => s + Number(w.amount), 0);

  const columns = [
    { key: "id", header: "Ref", render: (w: any) => <span className="font-mono text-[10px] text-muted-foreground">{w.id.slice(0, 8)}</span> },
    { key: "amount", header: "Amount", render: (w: any) => <span className="text-foreground font-bold">${Number(w.amount).toFixed(2)}</span> },
    { key: "bank", header: "Bank", render: (w: any) => <span className="text-muted-foreground">{w.bank_name} •••{(w.account_number || "").slice(-4)}</span> },
    { key: "date", header: "Requested", render: (w: any) => <span className="text-muted-foreground text-xs">{new Date(w.created_at).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (w: any) => <StatusBadge status={w.status} size="md" /> },
    { key: "actions", header: "", render: (w: any) => (
      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setViewing(w)}>
        <Receipt className="w-3 h-3 mr-1" /> Details
      </Button>
    )},
  ];

  return (
    <>
      <PageHeader
        title="Withdrawals"
        description="Transfer your earnings"
        actions={
          <Button onClick={() => setOpen(true)} disabled={available < 50} className="bg-primary hover:bg-primary/90 rounded-xl">
            <Plus className="w-4 h-4 mr-1.5" /> New withdrawal
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {earningsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Available Balance" value={`$${available.toFixed(2)}`} icon={Wallet} positive />
            <StatCard label="Pending Withdrawals" value={`$${pendingTotal.toFixed(2)}`} change={`${(withdrawals || []).filter((w: any) => w.status === "pending").length} requests`} />
            <StatCard label="Total Earned" value={`$${Number(earnings?.totalEarned || 0).toFixed(2)}`} positive />
          </>
        )}
      </div>

      <div className="bento-card">
        <h3 className="font-bold text-foreground mb-4">Withdrawal History</h3>
        {withdrawalsLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : (
          <DataTable
            columns={columns}
            data={withdrawals || []}
            keyExtractor={(w: any) => w.id}
            emptyTitle="No withdrawals yet"
            emptyDescription="Once you request a withdrawal, it will appear here."
          />
        )}
      </div>

      {/* Request dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Request withdrawal</DialogTitle>
            <DialogDescription>Funds will be sent to your bank within 3 business days.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Available balance</span>
              <span className="text-lg font-black text-primary">${available.toFixed(2)}</span>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (USD)</Label>
              <Input type="number" step="0.01" {...form.register("amount")} className="rounded-xl" />
              {form.formState.errors.amount && <p className="text-xs text-destructive mt-1">{form.formState.errors.amount.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">Minimum: $50</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1"><Building2 className="w-3 h-3" /> Bank name</Label>
              <Input {...form.register("bank_name")} placeholder="Chase Bank" className="rounded-xl" />
              {form.formState.errors.bank_name && <p className="text-xs text-destructive mt-1">{form.formState.errors.bank_name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1"><Hash className="w-3 h-3" /> Account #</Label>
                <Input {...form.register("account_number")} placeholder="•••• •••• 4523" className="rounded-xl font-mono" />
                {form.formState.errors.account_number && <p className="text-xs text-destructive mt-1">{form.formState.errors.account_number.message}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Routing # (optional)</Label>
                <Input {...form.register("routing_number")} className="rounded-xl font-mono" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={request.isPending} className="bg-primary hover:bg-primary/90 rounded-xl">
                {request.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Request withdrawal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => { if (!o) setViewing(null); }}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Withdrawal details</DialogTitle>
            <DialogDescription>Reference {viewing?.id?.slice(0, 8)}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <Row label="Amount" value={`$${Number(viewing.amount).toFixed(2)}`} />
              <Row label="Status" value={<StatusBadge status={viewing.status} size="md" />} />
              <Row label="Bank" value={`${viewing.bank_name} •••${(viewing.account_number || "").slice(-4)}`} />
              <Row label="Routing" value={viewing.routing_number || "—"} />
              <Row label="Requested" value={new Date(viewing.created_at).toLocaleString()} />
              <Row label="Processed" value={viewing.processed_at ? new Date(viewing.processed_at).toLocaleString() : "—"} />
              {viewing.rejection_reason && <Row label="Reason" value={<span className="text-destructive">{viewing.rejection_reason}</span>} />}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}
