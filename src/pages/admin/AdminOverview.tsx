import { Users, DollarSign, BookOpen, Star, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { useAdminStats, useAdminBookings } from "@/hooks/useAdmin";

export default function AdminOverview() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: recent } = useAdminBookings({ pageSize: 5 });

  if (isLoading || !stats) {
    return (
      <>
        <PageHeader title="Overview" description="Loading platform metrics…" />
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

  return (
    <>
      <PageHeader title="Platform Overview" description="Real-time metrics across the platform" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(0)}`} icon={DollarSign} positive change={`Fees: $${stats.totalFees.toFixed(0)}`} />
        <StatCard label="Users" value={String(stats.totalUsers)} icon={Users} change={`${stats.totalTutors} tutors`} positive />
        <StatCard label="Bookings" value={String(stats.totalBookings)} icon={BookOpen} positive />
        <StatCard label="Avg Rating" value={stats.avgRating.toFixed(2)} icon={Star} change={`${stats.pendingVerifications} pending verifs`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Last 7 Days" subtitle="Revenue & sessions">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.chart}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#rev)" strokeWidth={2} />
              <Line type="monotone" dataKey="sessions" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Revenue" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthly}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bento-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Recent Bookings</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Live data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Tutor</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recent?.items || []).map((b: any) => (
                <tr key={b.id} className="border-b border-border/40">
                  <td className="py-3 text-foreground">{b.student_name}</td>
                  <td className="py-3 text-muted-foreground">{b.tutor_name}</td>
                  <td className="py-3 text-muted-foreground">{b.subject}</td>
                  <td className="py-3 text-foreground font-bold">${Number(b.amount || 0).toFixed(0)}</td>
                  <td className="py-3"><StatusBadge status={b.status || "pending"} size="md" /></td>
                </tr>
              ))}
              {(!recent?.items || recent.items.length === 0) && (
                <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
