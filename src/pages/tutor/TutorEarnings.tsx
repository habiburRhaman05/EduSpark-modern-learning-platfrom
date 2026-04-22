import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutorEarnings } from "@/hooks/useTutorEarnings";
import { RecentWithdrawalsCard } from "@/components/tutor/RecentWithdrawalsCard";

const MIN_WITHDRAWAL = 10;

export default function TutorEarnings() {
  const { data, isLoading } = useTutorEarnings();

  if (isLoading || !data) {
    return (
      <>
        <PageHeader title="Earnings & Wallet" description="Track your income" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </>
    );
  }

  const monthDelta = data.thisMonth - data.lastMonth;
  const canWithdraw = data.availableBalance >= MIN_WITHDRAWAL;

  const withdrawCta = canWithdraw ? (
    <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl font-bold">
      <Link to="/tutor/withdraw"><Plus className="w-4 h-4 mr-1.5" /> Request withdrawal</Link>
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled className="rounded-xl opacity-60">
            <Plus className="w-4 h-4 mr-1.5" /> Request withdrawal
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Minimum ${MIN_WITHDRAWAL} balance required (you have ${data.availableBalance.toFixed(2)})</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <>
      <PageHeader title="Earnings & Wallet" description="Your tutoring income, balance and payouts" actions={withdrawCta} />

      {/* Wallet hero */}
      <div className="bento-card mb-6 bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5" /> Wallet Balance
            </div>
            <p className="text-4xl sm:text-5xl font-black text-foreground mt-1">${data.availableBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Earnings credit your wallet after each completed session.
            </p>
          </div>
          <div className="sm:hidden">{withdrawCta}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Payouts" value={`$${data.pendingPayouts.toFixed(0)}`} change="Processing" />
        <StatCard label="This Month" value={`$${data.thisMonth.toFixed(0)}`} change={`${monthDelta >= 0 ? "+" : ""}$${monthDelta.toFixed(0)}`} positive={monthDelta >= 0} />
        <StatCard label="Last Month" value={`$${data.lastMonth.toFixed(0)}`} icon={DollarSign} />
        <StatCard label="Total Earned" value={`$${data.totalEarned.toFixed(0)}`} icon={TrendingUp} positive />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Weekly Earnings">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.weekly}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthly}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Line type="monotone" dataKey="earnings" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Recent Transactions</h3>
          {data.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {data.recent.map((p: any, idx: number) => {
                const credit = p.status === "completed";
                const key = p.id || `${p.created_at}-${idx}`;
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${credit ? "bg-accent/10" : "bg-warning/10"}`}>
                        {credit ? <ArrowUpRight className="w-4 h-4 text-accent" /> : <ArrowDownRight className="w-4 h-4 text-warning" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground capitalize">{p.status}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${credit ? "text-accent" : "text-foreground"}`}>+${Number(p.net_amount ?? p.amount ?? 0).toFixed(0)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <RecentWithdrawalsCard />
      </div>
    </>
  );
}
