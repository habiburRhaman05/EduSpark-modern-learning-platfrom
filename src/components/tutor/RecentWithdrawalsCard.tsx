import { Link } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyWithdrawals } from "@/hooks/useTutorWithdrawals";

export function RecentWithdrawalsCard({ basePath = "/tutor" }: { basePath?: string }) {
  const { data: withdrawals, isLoading } = useMyWithdrawals();
  const recent = (withdrawals || []).slice(0, 5);

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Receipt className="w-4 h-4 text-muted-foreground" />
          Recent Withdrawals
        </h3>
        <Link to={`${basePath}/withdraw`} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
        </div>
      ) : recent.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No withdrawals yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Request your first withdrawal once your balance reaches $10.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((w: any) => (
            <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">${Number(w.amount).toFixed(2)}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {w.bank_name} •••{(w.account_number || "").slice(-4)} · {new Date(w.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={w.status} size="md" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
