import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, ArrowLeft, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VerifiedAvatar } from "@/components/VerifiedAvatar";
import { useCategories } from "@/hooks/useCategories";
import { useTutors } from "@/hooks/useTutors";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function CategoryExplore() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const slug = params.get("cat") || "";
  const minRating = Number(params.get("rating") || 0);
  const page = Number(params.get("page") || 1);

  const setParam = (k: string, v: string | number) => {
    const next = new URLSearchParams(params);
    if (!v && v !== 0) next.delete(k);
    else next.set(k, String(v));
    if (k !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const [searchInput, setSearchInput] = useState(search);
  const { data: categories, isLoading: catLoading } = useCategories();

  const filteredCats = (categories || []).filter((c: any) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.subjects || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedCat = (categories || []).find((c: any) => c.slug === slug);
  const { data: tutorData, isLoading: tutorsLoading } = useTutors({
    category: selectedCat?.name,
    minRating,
    page,
    pageSize: 9,
    sortBy: "rating",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selectedCat ? (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-black mb-2">Explore <span className="text-gradient">Categories</span></h1>
              <p className="text-muted-foreground mb-6">Browse subjects and find expert tutors in every field</p>
            </motion.div>

            <form onSubmit={(e) => { e.preventDefault(); setParam("q", searchInput); }} className="relative max-w-md mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search categories or subjects…" className="pl-10 h-10 glass border-border rounded-xl text-sm" />
            </form>

            {catLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
              </div>
            ) : filteredCats.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No categories match.</p>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCats.map((cat: any) => (
                  <motion.button
                    key={cat.id}
                    variants={fadeUp}
                    onClick={() => setParam("cat", cat.slug)}
                    className="bento-card flex flex-col items-center text-center py-6 group cursor-pointer hover:border-primary/40 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-black text-primary">{cat.name[0]}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{cat.tutor_count} tutor{cat.tutor_count === 1 ? "" : "s"}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {(cat.subjects || []).slice(0, 3).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground">{s}</span>
                      ))}
                      {(cat.subjects || []).length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground">+{(cat.subjects || []).length - 3}</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          <>
            <button onClick={() => setParam("cat", "")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" /> All categories
            </button>

            <div className="bento-card mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-black text-primary">{selectedCat.name[0]}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-foreground">{selectedCat.name}</h1>
                  <p className="text-sm text-muted-foreground">{tutorData?.total ?? 0} tutor{tutorData?.total === 1 ? "" : "s"} available</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedCat.subjects || []).slice(0, 6).map((s: string) => (
                  <span key={s} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">{s}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-medium text-muted-foreground mr-1">Rating:</span>
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setParam("rating", r)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${minRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}
                >
                  {r === 0 ? "Any" : `${r}+ ★`}
                </button>
              ))}
            </div>

            {tutorsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
              </div>
            ) : (tutorData?.items.length ?? 0) === 0 ? (
              <div className="bento-card text-center py-12">
                <p className="text-muted-foreground">No tutors yet in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(tutorData?.items || []).map((tutor) => (
                    <Link key={tutor.id} to={`/tutors/${tutor.id}`} className="bento-card group block">
                      <div className="flex items-center gap-3 mb-3">
                        <VerifiedAvatar src={tutor.avatar_url} name={tutor.full_name} size="md" isVerified={tutor.is_verified} />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{tutor.full_name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{tutor.category}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem] mb-3">{tutor.bio}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          <span className="text-xs font-semibold">{tutor.avg_rating.toFixed(1)}</span>
                          <span className="text-[10px] text-muted-foreground">({tutor.total_reviews})</span>
                        </div>
                        <span className="text-sm font-bold text-primary">${tutor.hourly_rate}/hr</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {tutorData && tutorData.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setParam("page", page - 1)} className="rounded-xl">Prev</Button>
                    <span className="text-sm text-muted-foreground">Page {page} of {tutorData.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page === tutorData.totalPages} onClick={() => setParam("page", page + 1)} className="rounded-xl">Next</Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
