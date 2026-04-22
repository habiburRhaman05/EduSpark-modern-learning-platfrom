import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, BookOpen, User, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBlogBySlug, useBlogList } from "@/hooks/useBlogs";

export default function BlogDetails() {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlogBySlug(slug);
  const { data: allPosts = [] } = useBlogList({ status: "published" });
  const related = (allPosts as any[]).filter((p) => p.id !== post?.id && p.category === post?.category).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-6">It may have been moved or unpublished.</p>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const wordCount = (post.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            {post.category && <span className="text-xs font-semibold text-primary">{post.category}</span>}
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mt-2 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {readMin} min read</span>
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> EduSpark Team</span>
            </div>
          </div>

          <div className="h-64 rounded-2xl bg-muted mb-8 overflow-hidden flex items-center justify-center">
            {post.cover_image ? (
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-16 h-16 text-muted-foreground/20" />
            )}
          </div>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary/40 pl-4">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content || "<p>No content yet.</p>" }}
          />

          {(post.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {(post.tags as string[]).map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">#{tag}</span>
              ))}
            </div>
          )}
        </motion.article>

        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-foreground mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((p: any) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="bento-card group">
                  {p.category && <span className="text-xs font-semibold text-primary">{p.category}</span>}
                  <h4 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(p.created_at).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
