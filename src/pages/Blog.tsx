import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useURLFilters } from "@/hooks/useURLFilters";
import { Pagination } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { useBlogList } from "@/hooks/useBlogs";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function Blog() {
  const { search, category, setFilter, page, setPage, paginate } = useURLFilters({ perPage: 9 });
  const { data: posts = [], isLoading } = useBlogList({ status: "published", search, category });

  const cats = useMemo(
    () => Array.from(new Set(posts.map((p: any) => p.category).filter(Boolean))) as string[],
    [posts]
  );
  const { items: paginated, totalPages, total } = paginate(posts);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-black mb-4">Our <span className="text-gradient">Blog</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Insights, tips, and stories from the world of online learning</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Search posts..." className="pl-10 h-10 glass border-border rounded-xl text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter("category", "")} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${!category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>All</button>
            {cats.map((c) => (
              <button key={c} onClick={() => setFilter("category", c)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bento-card">
                <Skeleton className="h-40 rounded-xl mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bento-card text-center py-16">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground mb-1">No articles yet</h3>
            <p className="text-sm text-muted-foreground">Check back soon — moderators are working on great content.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((post: any, i: number) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog/${post.slug}`} className="bento-card group cursor-pointer block h-full">
                    <div className="h-40 rounded-xl bg-muted mb-4 overflow-hidden flex items-center justify-center">
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                      )}
                    </div>
                    {post.category && <span className="text-xs font-semibold text-primary">{post.category}</span>}
                    <h3 className="font-bold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} perPage={9} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
