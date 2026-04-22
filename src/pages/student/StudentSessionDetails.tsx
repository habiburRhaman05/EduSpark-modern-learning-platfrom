import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Video, Calendar, MessageSquare, Star, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useBooking } from "@/hooks/useBookings";
import { useBookingReview, useSubmitReview } from "@/hooks/useReviews";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { toast } from "sonner";

export default function StudentSessionDetails() {
  const { id } = useParams();
  const { data: booking, isLoading } = useBooking(id);
  const { data: review } = useBookingReview(id);
  const submitReview = useSubmitReview();
  const { data: tutorProfileFull } = useQuery({
    queryKey: ["tutor-profile-by-user", booking?.tutor_id],
    enabled: !!booking?.tutor_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("tutor_profiles")
        .select("id, user_id, hourly_rate, subjects")
        .eq("user_id", booking!.tutor_id)
        .maybeSingle();
      return data;
    },
  });

  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reschedOpen, setReschedOpen] = useState(false);

  if (isLoading) {
    return (
      <>
        <Link to="/dashboard/sessions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Sessions
        </Link>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <div className="bento-card text-center py-12">
        <p className="text-muted-foreground">Booking not found.</p>
        <Link to="/dashboard/sessions"><Button variant="outline" className="mt-4">Back to Sessions</Button></Link>
      </div>
    );
  }

  const tutor: any = booking.tutor;
  const canReview = booking.status === "completed" && !review;
  const tutorRate = Number(tutorProfileFull?.hourly_rate || (Number(booking.amount || 0) / Math.max(1, Number(booking.duration_minutes || 60) / 60)));
  const tutorSubjects: string[] = tutorProfileFull?.subjects || [booking.subject];

  const handleSubmitReview = async () => {
    try {
      await submitReview.mutateAsync({
        bookingId: booking.id,
        tutorUserId: booking.tutor_id,
        rating,
        comment,
      });
      toast.success("Thanks for your review!");
      setReviewOpen(false);
      setComment("");
    } catch (e: any) {
      toast.error(e.message || "Could not submit review");
    }
  };

  return (
    <>
      <Link to="/dashboard/sessions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Sessions
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bento-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-foreground mb-1">{booking.subject}</h2>
                <p className="text-sm text-muted-foreground font-mono">#{booking.id.slice(0, 8)}</p>
              </div>
              <StatusBadge status={booking.status} size="md" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Cell label="Date & Time" value={new Date(booking.scheduled_at).toLocaleString()} />
              <Cell label="Duration" value={`${booking.duration_minutes || 60} min`} />
              <Cell label="Amount" value={`$${Number(booking.amount || 0)}`} />
              <Cell label="Payment" value={<span className="capitalize">{booking.payment_status}</span>} />
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 sm:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Meeting Link</p>
                {booking.meeting_link ? (
                  <a href={booking.meeting_link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline truncate block">{booking.meeting_link}</a>
                ) : (
                  <p className="text-sm text-muted-foreground">Will be shared closer to session time</p>
                )}
              </div>
            </div>
          </div>

          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-3">Session Notes</h3>
            <p className="text-sm text-muted-foreground">{booking.notes || "No notes added yet."}</p>
          </div>

          {/* Review section */}
          {(review || canReview) && (
            <div className="bento-card">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" /> Your Review
              </h3>
              {review ? (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Number(review.rating) ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                    ))}
                    <span className="text-sm font-bold text-foreground ml-2">{review.rating}/5</span>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>}
                  <p className="text-[11px] text-muted-foreground">Submitted {new Date(review.created_at).toLocaleDateString()}</p>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">Share how this session went. You can only leave one review.</p>
                  <Button size="sm" onClick={() => setReviewOpen(true)} className="bg-primary hover:bg-primary/90 rounded-xl">
                    <Star className="w-4 h-4 mr-1.5" /> Leave Review
                  </Button>
                </div>
              )}
            </div>
          )}

          {booking.cancellation_reason && (
            <div className="bento-card">
              <h3 className="font-bold text-foreground mb-3">Cancellation Reason</h3>
              <p className="text-sm text-muted-foreground">{booking.cancellation_reason}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-4">Tutor</h3>
            {tutor ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
                    {tutor.avatar_url ? <img src={tutor.avatar_url} alt={tutor.full_name} className="w-full h-full object-cover" /> : (tutor.full_name||"T")[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tutor.full_name}</p>
                    <p className="text-xs text-muted-foreground">Tutor</p>
                  </div>
                </div>
                {tutor.bio && <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{tutor.bio}</p>}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Tutor info unavailable</p>
            )}
          </div>

          <div className="bento-card space-y-3">
            <h3 className="font-bold text-foreground mb-2">Actions</h3>
            {booking.status === "confirmed" && (
              <Link to={`/session/${booking.id}/call`}>
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl"><Video className="w-4 h-4 mr-2" />Join Session</Button>
              </Link>
            )}
            <Button variant="outline" className="w-full rounded-xl"><MessageSquare className="w-4 h-4 mr-2" />Message Tutor</Button>
            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <Button variant="outline" onClick={() => setReschedOpen(true)} className="w-full rounded-xl">
                <Calendar className="w-4 h-4 mr-2" />Reschedule
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Rate your session</DialogTitle>
            <DialogDescription>How was your session with {tutor?.full_name}?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-3">
              {[1,2,3,4,5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-9 h-9 ${(hoverRating || rating) >= n ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share details of your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-xl min-h-[100px]"
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview} disabled={submitReview.isPending} className="bg-primary hover:bg-primary/90 rounded-xl">
              {submitReview.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Submit review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule = book a new session */}
      {reschedOpen && (
        <BookingDialog
          open={reschedOpen}
          onClose={() => setReschedOpen(false)}
          tutorUserId={booking.tutor_id}
          tutorProfileId={tutorProfileFull?.id}
          tutorName={tutor?.full_name || "Tutor"}
          hourlyRate={tutorRate}
          subjects={tutorSubjects}
        />
      )}
    </>
  );
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
