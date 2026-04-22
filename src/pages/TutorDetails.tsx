import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Globe, ArrowLeft, Calendar, MessageSquare, Heart, Loader2, ShieldCheck, GraduationCap, Languages, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTutor, useTutorAvailability, useTutorReviews } from "@/hooks/useTutors";
import { useSavedTutorIds, useToggleSavedTutor } from "@/hooks/useSavedTutors";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { VerifiedAvatar } from "@/components/VerifiedAvatar";
import { TutorDetailsSkeleton } from "@/skeletons/TutorDetailsSkeleton";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tutor, isLoading } = useTutor(id);
  const { data: availability } = useTutorAvailability(id);
  const { data: reviews } = useTutorReviews(tutor?.user_id);
  const { user, role } = useAuth();
  const { data: savedIds } = useSavedTutorIds();
  const toggleSaved = useToggleSavedTutor();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [tab, setTab] = useState("about");

  const isSaved = !!(tutor?.user_id && savedIds?.has(tutor.user_id));
  const profile: any = tutor?.profiles;
  const fullName = profile?.full_name || "Tutor";
  const isBlockedRole = !!user && !!role && role !== "student";

  const handleBookClick = () => {
    if (!user) {
      toast.error("Please sign in to book");
      navigate("/login");
      return;
    }
    if (isBlockedRole) {
      toast.error(`Only students can book sessions. You're signed in as ${role}.`);
      return;
    }
    setBookingOpen(true);
  };

  // Rating distribution for reviews tab
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = (reviews || []).filter((r: any) => r.rating === star).length;
    const pct = reviews?.length ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tutors
        </Link>

        {isLoading || !tutor ? (
          <TutorDetailsSkeleton />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6 min-w-0">
              {/* HERO */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bento-card p-0 overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-primary/30 via-accent/20 to-transparent relative">
                  <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_2px_2px,hsl(var(--foreground))_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
                </div>
                <div className="px-6 pb-6 -mt-12 relative">
                  <div className="flex items-end gap-4 flex-wrap">
                    <div className="ring-4 ring-card rounded-full">
                      <VerifiedAvatar src={profile?.avatar_url} name={fullName} size="xl" isVerified={!!tutor.is_verified} status={tutor.verification_status as any} />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground">{fullName}</h1>
                        {tutor.is_verified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
                            <BadgeCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{tutor.headline || `${tutor.category || "Subject"} Expert`}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-warning text-warning" /><span className="font-bold text-foreground">{Number(tutor.avg_rating || 0).toFixed(1)}</span> ({tutor.total_reviews || 0} reviews)</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {tutor.total_sessions || 0}+ sessions</span>
                    <span className="inline-flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> {(tutor.languages || ["English"]).join(", ")}</span>
                    {(tutor as any).response_time && <span className="inline-flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Replies in {(tutor as any).response_time}</span>}
                  </div>
                </div>
              </motion.div>

              {/* TABS */}
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="about" className="rounded-lg">About</TabsTrigger>
                  <TabsTrigger value="subjects" className="rounded-lg">Subjects</TabsTrigger>
                  <TabsTrigger value="availability" className="rounded-lg">Availability</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tab === "about" && (
                        <div className="bento-card space-y-4">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile?.bio || tutor.headline || "This tutor hasn't added a bio yet."}</p>
                          {tutor.education && (
                            <div className="flex items-start gap-2 pt-3 border-t border-border/50">
                              <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-foreground">Education</p>
                                <p className="text-sm text-muted-foreground">{tutor.education}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {tab === "subjects" && (
                        <div className="bento-card">
                          <div className="flex flex-wrap gap-2">
                            {(tutor.subjects || []).map((s: string) => (
                              <span key={s} className="px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">{s}</span>
                            ))}
                            {(tutor.subjects || []).length === 0 && <span className="text-sm text-muted-foreground">No subjects listed.</span>}
                          </div>
                        </div>
                      )}

                      {tab === "availability" && (
                        <div className="bento-card">
                          {(availability || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">No availability set yet.</p>
                          ) : (
                            <div className="grid grid-cols-7 gap-2">
                              {DAYS.map((day, idx) => {
                                const slots = (availability || []).filter((a: any) => a.day_of_week === idx);
                                return (
                                  <div key={day} className="space-y-1">
                                    <p className="text-[11px] font-bold text-muted-foreground text-center mb-1.5">{day}</p>
                                    {slots.length === 0 ? (
                                      <div className="h-12 rounded-lg bg-muted/30 border border-dashed border-border/50" />
                                    ) : (
                                      slots.map((s: any) => (
                                        <div key={s.id} className="text-[10px] font-medium px-1.5 py-1.5 rounded-lg bg-success/10 text-success text-center">
                                          {s.start_time?.slice(0, 5)}<br />–<br />{s.end_time?.slice(0, 5)}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {tab === "reviews" && (
                        <div className="space-y-4">
                          {/* Rating summary */}
                          <div className="bento-card grid sm:grid-cols-[auto_1fr] gap-6 items-center">
                            <div className="text-center">
                              <p className="text-5xl font-black text-foreground">{Number(tutor.avg_rating || 0).toFixed(1)}</p>
                              <div className="flex justify-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(Number(tutor.avg_rating || 0)) ? "fill-warning text-warning" : "text-muted"}`} />
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{tutor.total_reviews || 0} reviews</p>
                            </div>
                            <div className="space-y-1.5">
                              {ratingDistribution.map(({ star, count, pct }) => (
                                <div key={star} className="flex items-center gap-2 text-xs">
                                  <span className="w-3 text-muted-foreground">{star}</span>
                                  <Star className="w-3 h-3 fill-warning text-warning" />
                                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-warning rounded-full transition-all" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review list */}
                          {!reviews?.length ? (
                            <div className="bento-card text-center py-8">
                              <p className="text-sm text-muted-foreground">No reviews yet — be the first to book!</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {(reviews || []).map((r: any) => (
                                <motion.div
                                  key={r.id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bento-card"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                        {(r.profiles?.full_name || "S")[0]}
                                      </div>
                                      <span className="text-sm font-semibold text-foreground">{r.profiles?.full_name || "Student"}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex gap-0.5 mb-2">
                                    {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </div>

            {/* STICKY RIGHT RAIL */}
            <div className="lg:w-80 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bento-card sticky top-24 space-y-4"
              >
                <div className="text-center pb-4 border-b border-border/50">
                  <p className="text-4xl font-black text-foreground">${Number(tutor.hourly_rate)}<span className="text-base font-normal text-muted-foreground">/hr</span></p>
                  <p className="text-xs text-muted-foreground mt-1">First session — full money-back guarantee</p>
                </div>

                {isBlockedRole ? (
                  <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning">
                    Booking is for students only. You're signed in as <span className="font-semibold capitalize">{role}</span>.
                  </div>
                ) : (
                  <Button
                    onClick={handleBookClick}
                    className="w-full h-12 bg-primary hover:bg-primary/90 glow-primary rounded-xl font-bold"
                  >
                    <Calendar className="w-4 h-4 mr-2" /> Book a Session
                  </Button>
                )}

                {user && !isBlockedRole && (
                  <Button
                    variant="outline"
                    disabled={toggleSaved.isPending}
                    className="w-full h-11 border-border rounded-xl hover:bg-muted/50"
                    onClick={() => toggleSaved.mutate(
                      { tutorUserId: tutor.user_id, currentlySaved: isSaved },
                      {
                        onSuccess: () => toast.success(isSaved ? "Removed from saved" : "Saved!"),
                        onError: () => toast.error("Couldn't update"),
                      }
                    )}
                    aria-label={isSaved ? "Remove from saved" : "Save tutor"}
                  >
                    {toggleSaved.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…</>
                    ) : (
                      <><Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-destructive text-destructive" : ""}`} /> {isSaved ? "Saved" : "Save Tutor"}</>
                    )}
                  </Button>
                )}

                <Button variant="outline" className="w-full h-11 border-border rounded-xl hover:bg-muted/50">
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Message
                </Button>

                <div className="pt-4 border-t border-border space-y-2.5">
                  <Stat label="Sessions Done" value={`${tutor.total_sessions || 0}+`} />
                  <Stat label="Reviews" value={String(tutor.total_reviews || 0)} />
                  <Stat label="Rating" value={`${Number(tutor.avg_rating || 0).toFixed(1)} ★`} />
                  <Stat label="Verified" value={tutor.is_verified ? "Yes" : "Pending"} accent={tutor.is_verified} />
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Secure booking · Cancel free up to 24h before
                </div>
              </motion.div>
            </div>

            <BookingDialog
              open={bookingOpen}
              onClose={() => setBookingOpen(false)}
              tutorUserId={tutor.user_id}
              tutorProfileId={tutor.id}
              tutorName={fullName}
              hourlyRate={Number(tutor.hourly_rate || 0)}
              subjects={tutor.subjects || []}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${accent ? "text-success" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
