import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogList } from "@/hooks/useBlogs";
import { blogPosts as fallbackPosts } from "@/lib/mock-data";

export function BlogSection() {
  const { data, isLoading } = useBlogList({ status: "published" });
  const posts = (data && data.length > 0)
    ? data.slice(0, 3).map((p: any) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category || "Article",
        date: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
        cover: p.cover_image,
      }))
    : fallbackPosts.slice(0, 3).map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, date: p.date, cover: null }));

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-info/10 text-info text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" /> Blog & insights
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              Latest from the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">blog</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">Tips, insights and stories from the world of online learning.</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="rounded-xl border-border/60">All articles <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)
            : posts.map((post: any, i: number) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block rounded-3xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5">
                      {post.cover ? (
                        <img src={post.cover} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-14 h-14 text-primary/30" strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold text-primary border border-border/60">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-foreground text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span className="inline-flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
}

function BlogSkeleton() {
  return (
    <div className="rounded-3xl bg-card border border-border/60 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
