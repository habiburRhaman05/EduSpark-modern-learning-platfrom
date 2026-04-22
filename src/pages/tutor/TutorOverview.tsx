import { Users, BookOpen, DollarSign, Star } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTutorDashboardStats, useTutorUpcomingClasses } from "@/hooks/useTutorDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorOverview() {
  const { data: stats, isLoading } = useTutorDashboardStats();
  const { data: upcoming, isLoading: upLoading } = useTutorUpcomingClasses();

  if (isLoading || !stats) {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <Skeleton className="lg:col-span-2 h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </>
    );
  }

  const cards = [
    { label: "Total Students", value: stats.totalStudents.toString(), icon: Users },
    { label: "Active Sessions", value: stats.activeSessions.toString(), icon: BookOpen },
    { label: "Earnings", value: `$${stats.earnings.toFixed(0)}`, icon: DollarSign, positive: true },
    { label: "Avg Rating", value: stats.avgRating ? stats.avgRating.toFixed(1) : "—", icon: Star, positive: true },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => <StatCard key={i} label={c.label} value={c.value} icon={c.icon} positive={(c as any).positive} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Sessions & Revenue" subtitle="Last 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.chart}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Upcoming Classes</h3>
          {upLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : (upcoming || []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No upcoming classes</p>
          ) : (
            <div className="space-y-3">
              {(upcoming || []).map((c: any) => (
                <div key={c.id} className="p-3 rounded-xl bg-muted/30 border border-border/40">
                  <p className="text-xs text-muted-foreground">{new Date(c.scheduled_at).toLocaleString()}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{c.subject}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{c.student_name}</span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ChartCard title="Subjects Breakdown" subtitle="By session count">
        {stats.pie.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No data yet</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.pie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                  {stats.pie.map((entry: any, i: number) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
              {stats.pie.map((d: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  <span className="text-muted-foreground truncate">{d.name}</span>
                  <span className="ml-auto font-medium text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </ChartCard>
    </>
  );
}
