import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" /> Categories
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              Explore by{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">category</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">Hand‑curated learning paths with expert tutors ready to guide you from fundamentals to mastery.</p>
          </div>
          <Link to="/categories">
            <Button variant="outline" className="rounded-xl border-border/60">View all <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.slice(0, 8).map((cat: any, i: number) => (
                <motion.div
                  key={cat.id || cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    to={`/categories?category=${encodeURIComponent(cat.name)}`}
                    className="group relative block rounded-2xl p-6 bg-card border border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        {cat.icon || "📚"}
                      </div>
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{cat.tutor_count || 0}</span> {cat.tutor_count === 1 ? "tutor" : "tutors"} · {(cat.subjects?.length || 0)} subjects
                      </p>
                      <div className="mt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                        Explore <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {!isLoading && categories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No categories available yet.</div>
        )}
      </div>
    </section>
  );
}

function CategorySkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-card border border-border/60">
      <Skeleton className="w-14 h-14 rounded-2xl mb-4" />
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
