import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBookingReview(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["booking-review", bookingId],
    enabled: !!bookingId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("booking_id", bookingId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export interface SubmitReviewInput {
  bookingId: string;
  tutorUserId: string;
  rating: number;
  comment: string;
}

export function useSubmitReview() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitReviewInput) => {
      if (!user) throw new Error("Not authenticated");
      // Insert review (unique on booking_id will block duplicates)
      const { data: review, error } = await supabase
        .from("reviews")
        .insert({
          booking_id: input.bookingId,
          tutor_id: input.tutorUserId,
          student_id: user.id,
          rating: input.rating,
          comment: input.comment || null,
          is_published: true,
        })
        .select()
        .single();
      if (error) {
        if ((error as any).code === "23505") throw new Error("You've already reviewed this session");
        throw error;
      }

      // Recompute tutor avg_rating + total_reviews
      const { data: allReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("tutor_id", input.tutorUserId);
      const total = (allReviews || []).length;
      const avg = total ? (allReviews || []).reduce((s, r) => s + Number(r.rating), 0) / total : 0;
      await supabase
        .from("tutor_profiles")
        .update({ avg_rating: Number(avg.toFixed(2)), total_reviews: total })
        .eq("user_id", input.tutorUserId);

      return review;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["booking-review", vars.bookingId] });
      qc.invalidateQueries({ queryKey: ["tutor-reviews"] });
      qc.invalidateQueries({ queryKey: ["tutor", vars.tutorUserId] });
      qc.invalidateQueries({ queryKey: ["tutors"] });
    },
  });
}
