import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicReviews } from "@/hooks/usePublicReviews";
import { testimonials as fallbackTestimonials } from "@/lib/mock-data";

export function TestimonialsSection() {
  const { data: reviews, isLoading } = usePublicReviews(8);

  // Fallback to seeded testimonials if no reviews exist yet
  const items = (reviews && reviews.length > 0)
    ? reviews.slice(0, 4).map((r) => ({
        name: r.student?.full_name || "Anonymous learner",
        role: "Verified student",
        text: r.comment || "",
        rating: r.rating,
        avatar: r.student?.avatar_url || null,
      }))
    : fallbackTestimonials.slice(0, 4).map((t) => ({ ...t, avatar: null }));

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            What our{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">learners say</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Real stories from learners who transformed their skills with EduSpark.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ReviewSkeleton key={i} />)
            : items.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-3xl bg-card border border-border/60 p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
                >
                  <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/15 group-hover:text-primary/25 transition-colors" strokeWidth={1.5} />
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3.5 h-3.5 ${j < t.rating ? "fill-warning text-warning" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-6 line-clamp-5 min-h-[100px]">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                        {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

function ReviewSkeleton() {
  return (
    <div className="rounded-3xl bg-card border border-border/60 p-6">
      <Skeleton className="h-3 w-20 mb-4" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-3/4 mb-6" />
      <div className="flex items-center gap-3 pt-4 border-t border-border/60">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-3 w-24 mb-1.5" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
    </div>
  );
}
