import { Link } from "react-router-dom";
import { Star, ArrowRight, BookOpen, Clock, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { useTutors } from "@/hooks/useTutors";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentOverview() {
  const { profile } = useAuth();
  const { data, isLoading } = useStudentDashboard();
  const { data: recommended, isLoading: recLoading } = useTutors({ pageSize: 4, sortBy: "rating" });

  const firstName = (profile?.full_name || "there").split(" ")[0];

  return (
    <>
      {/* Welcome Banner */}
      <div className="bento-card mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative z-10">
          <h2 className="text-xl font-black text-foreground mb-1">Welcome back, {firstName}! 👋</h2>
          {isLoading ? (
            <Skeleton className="h-4 w-72 mb-4" />
          ) : (
            <p className="text-sm text-muted-foreground mb-4">You have {data?.upcomingCount ?? 0} upcoming sessions.</p>
          )}
          <div className="flex gap-3">
            <Link to="/dashboard/sessions"><Button size="sm" className="bg-primary hover:bg-primary/90 rounded-xl">View Sessions</Button></Link>
            <Link to="/tutors"><Button size="sm" variant="outline" className="border-white/[0.08] rounded-xl">Browse Tutors</Button></Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading || !data ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          data.stats.map((stat, i) => (
            <StatCard key={i} label={stat.label} value={stat.value} change={stat.change} positive={stat.positive}
              icon={i === 0 ? Clock : i === 1 ? BookOpen : i === 2 ? Heart : TrendingUp} />
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Study Hours This Week" className="lg:col-span-2">
          {isLoading || !data ? <Skeleton className="h-[250px] w-full" /> : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.chartData}>
                <XAxis dataKey="name" stroke="hsl(215 20% 65%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215 20% 65%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(230 15% 8%)", border: "1px solid hsl(230 15% 18%)", borderRadius: "12px", color: "hsl(210 40% 96%)" }} />
                <Bar dataKey="sessions" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Sessions by Subject">
          {isLoading || !data ? <Skeleton className="h-[200px] w-full" /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                    {data.pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(230 15% 8%)", border: "1px solid hsl(230 15% 18%)", borderRadius: "12px", color: "hsl(210 40% 96%)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {data.pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-medium text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* Upcoming & Recent */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Upcoming Sessions</h3>
            <Link to="/dashboard/sessions" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : data?.upcomingClasses.length ? (
              data.upcomingClasses.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                  <p className="text-xs text-muted-foreground">{c.time}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{c.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{c.tutor}</span>
                    <StatusBadge status={c.level} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No upcoming sessions</p>
            )}
          </div>
        </div>
        <div className="lg:col-span-2 bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Recent Activity</h3>
            <Link to="/dashboard/sessions" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : data?.recentBookings.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-medium text-muted-foreground">Session</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">Tutor</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.map((b: any) => (
                    <tr key={b.id} className="border-b border-border/50">
                      <td className="py-3 text-foreground">{b.subject}</td>
                      <td className="py-3 text-muted-foreground">{b.tutorName}</td>
                      <td className="py-3 text-muted-foreground">{new Date(b.scheduled_at).toLocaleDateString()}</td>
                      <td className="py-3"><StatusBadge status={b.status} size="md" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No bookings yet. <Link to="/tutors" className="text-primary hover:underline">Find a tutor</Link></p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Tutors */}
      <div className="bento-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Recommended Tutors</h3>
          <Link to="/tutors"><Button variant="ghost" size="sm" className="text-primary">View All <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          ) : recommended?.items.length ? (
            recommended.items.map((t) => (
              <Link key={t.id} to={`/tutors/${t.id}`} className="p-4 rounded-xl bg-muted/30 border border-white/[0.04] hover:border-white/[0.1] transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                    {t.avatar_url ? <img src={t.avatar_url} alt={t.full_name} className="w-full h-full object-cover" /> : t.full_name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{t.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    <span className="text-xs font-medium">{t.avg_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs font-bold text-primary">${t.hourly_rate}/hr</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-sm text-muted-foreground text-center py-6">No tutors available yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
