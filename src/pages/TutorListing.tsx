import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, SlidersHorizontal, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTutors, useTutorCategories } from "@/hooks/useTutors";
import { useCategories } from "@/hooks/useCategories";
import { useSavedTutorIds, useToggleSavedTutor } from "@/hooks/useSavedTutors";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { VerifiedAvatar } from "@/components/VerifiedAvatar";
import { AITutorSearch } from "@/components/tutor/AITutorSearch";
import { Pagination } from "@/components/Pagination";
import { X } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function TutorListing() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const category = params.get("category") || "";
  const subject = params.get("subject") || "";
  const minRating = Number(params.get("rating") || 0);
  const sortBy = (params.get("sort") || "rating") as "rating" | "price-low" | "price-high";
  const page = Number(params.get("page") || 1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const setParam = (k: string, v: string | number) => {
    const next = new URLSearchParams(params);
    if (!v && v !== 0) next.delete(k);
    else next.set(k, String(v));
    if (k !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const { data: catData } = useCategories();
  const { data: liveCats } = useTutorCategories();
  const { data, isLoading } = useTutors({ search, category, subject, minRating, sortBy, page, pageSize: 9 });
  const { user } = useAuth();
  const { data: savedIds } = useSavedTutorIds();
  const toggleSaved = useToggleSavedTutor();

  const subjectsForCat =
    liveCats?.find((c) => c.category === category)?.subjects ||
    catData?.find((c) => c.name === category)?.subjects ||
    [];

  const hasActiveFilters = !!(search || category || subject || minRating);
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-2">Explore <span className="text-gradient">Tutors</span></h1>
          <p className="text-muted-foreground mb-6">Find the perfect tutor from our community of verified experts</p>
        </motion.div>

        <AITutorSearch />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bento-card space-y-6 sticky top-24">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Search</h3>
                <form onSubmit={(e) => { e.preventDefault(); setParam("q", searchInput); }} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Name or subject..." className="pl-10 h-10 glass border-white/[0.08] rounded-xl text-sm" />
                </form>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  <button onClick={() => { setParam("category",""); setParam("subject",""); }} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg ${!category ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>All categories</button>
                  {(catData || []).map((c) => (
                    <button key={c.id} onClick={() => { setParam("category", c.name); setParam("subject",""); }} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg ${category === c.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{c.name}</button>
                  ))}
                </div>
              </div>

              {category && subjectsForCat.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Subject</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setParam("subject","")} className={`px-3 py-1.5 text-xs rounded-full ${!subject ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>All</button>
                    {subjectsForCat.map(s => (
                      <button key={s} onClick={() => setParam("subject", s)} className={`px-3 py-1.5 text-xs rounded-full ${subject === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Min Rating</h3>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setParam("rating", r)} className={`flex-1 text-xs px-2 py-1.5 rounded-lg ${minRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>
                      {r === 0 ? "Any" : `${r}+ ★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden bento-card px-3 py-2">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground">{isLoading ? "Loading…" : `${data?.total ?? 0} tutors found`}</span>
              </div>
              <select value={sortBy} onChange={(e) => setParam("sort", e.target.value)} className="text-sm bg-muted border-none rounded-xl px-4 py-2 text-foreground">
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Active:</span>
                {search && <FilterChip label={`"${search}"`} onClear={() => { setSearchInput(""); setParam("q", ""); }} />}
                {category && <FilterChip label={category} onClear={() => { setParam("category", ""); setParam("subject", ""); }} />}
                {subject && <FilterChip label={subject} onClear={() => setParam("subject", "")} />}
                {minRating > 0 && <FilterChip label={`${minRating}+ ★`} onClear={() => setParam("rating", 0)} />}
                <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline ml-1">Clear all</button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLoading ? (
                [...Array(9)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
              ) : data?.items.length ? (
                data.items.map((tutor, i) => {
                  const isSaved = savedIds?.has(tutor.user_id) ?? false;
                  return (
                    <motion.div key={tutor.id} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: i * 0.04 }}>
                      <div className="bento-card group block h-full relative">
                        {user && (
                          <button
                            disabled={toggleSaved.isPending && toggleSaved.variables?.tutorUserId === tutor.user_id}
                            onClick={() => toggleSaved.mutate({ tutorUserId: tutor.user_id, currentlySaved: isSaved }, {
                              onSuccess: () => toast.success(isSaved ? "Removed from saved" : "Saved tutor"),
                              onError: () => toast.error("Couldn't update saved tutors"),
                            })}
                            className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10 disabled:opacity-50 ${isSaved ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-muted-foreground hover:text-destructive"}`}
                            aria-label={isSaved ? "Unsave tutor" : "Save tutor"}
                          >
                            {toggleSaved.isPending && toggleSaved.variables?.tutorUserId === tutor.user_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                            )}
                          </button>
                        )}
                        <Link to={`/tutors/${tutor.id}`} className="block">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="group-hover:scale-105 transition-transform">
                              <VerifiedAvatar src={tutor.avatar_url} name={tutor.full_name} size="md" isVerified={tutor.is_verified} />
                            </div>
                            <div className="min-w-0 pr-8">
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{tutor.full_name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{tutor.category}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">{tutor.bio}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-warning text-warning" />
                              <span className="text-sm font-semibold">{tutor.avg_rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({tutor.total_reviews})</span>
                            </div>
                            <span className="text-sm font-bold text-primary">${tutor.hourly_rate}/hr</span>
                          </div>
                          <Button size="sm" className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full bento-card text-center py-12">
                  <p className="text-muted-foreground">No tutors match your filters.</p>
                </div>
              )}
            </div>

            {data && (
              <Pagination
                page={page}
                totalPages={data.totalPages}
                total={data.total}
                perPage={9}
                onPageChange={(p) => setParam("page", p)}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
      {label}
      <button onClick={onClear} aria-label={`Clear ${label}`} className="hover:bg-primary/20 rounded-full p-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
