import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MapPin, BadgeCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutors } from "@/hooks/useTutors";

export function FeaturedTutors() {
  const { data, isLoading } = useTutors({ sortBy: "rating", page: 1, pageSize: 4 });
  const tutors = (data?.items || []).slice(0, 4);

  return (
    <section className="py-20 lg:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" /> Featured tutors
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              Most popular{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">teachers</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">Hand‑picked experts with outstanding student outcomes and verified credentials.</p>
          </div>
          <Link to="/tutors">
            <Button variant="outline" className="rounded-xl border-border/60">Explore tutors <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <TutorSkeleton key={i} />)
            : tutors.length === 0
              ? <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No tutors available yet.</div>
              : tutors.map((tutor: any, i: number) => (
                  <motion.div
                    key={tutor.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link
                      to={`/tutors/${tutor.id}`}
                      className="group relative block rounded-3xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                    >
                      {/* Cover gradient */}
                      <div className="h-24 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
                        {tutor.verified && (
                          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur text-[10px] font-bold text-primary border border-border/60">
                            <BadgeCheck className="w-3 h-3" /> Verified
                          </div>
                        )}
                      </div>

                      {/* Avatar (overlap) */}
                      <div className="px-5 -mt-9 relative">
                        <div className="relative inline-block">
                          {tutor.avatar_url ? (
                            <img src={tutor.avatar_url} alt={tutor.full_name} className="w-[72px] h-[72px] rounded-2xl object-cover ring-4 ring-card shadow-lg" />
                          ) : (
                            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-black text-primary-foreground ring-4 ring-card shadow-lg">
                              {(tutor.full_name || "T").split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                            </div>
                          )}
                          {tutor.is_active && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-card" />
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-3">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{tutor.full_name || "Tutor"}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{tutor.headline || tutor.category || "Expert tutor"}</p>

                        {tutor.location && (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2">
                            <MapPin className="w-3 h-3" /> <span className="line-clamp-1">{tutor.location}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="text-sm font-bold text-foreground">{Number(tutor.rating || 0).toFixed(1)}</span>
                            <span className="text-[11px] text-muted-foreground">({tutor.total_reviews || 0})</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground leading-none">from</p>
                            <p className="text-sm font-black text-primary">${tutor.hourly_rate || 0}<span className="text-[10px] font-medium text-muted-foreground">/hr</span></p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
        </div>
      </div>
    </section>
  );
}

function TutorSkeleton() {
  return (
    <div className="rounded-3xl bg-card border border-border/60 overflow-hidden">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="px-5 -mt-9">
        <Skeleton className="w-[72px] h-[72px] rounded-2xl ring-4 ring-card" />
      </div>
      <div className="p-5 pt-3 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <div className="flex justify-between pt-4 border-t border-border/60 mt-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
