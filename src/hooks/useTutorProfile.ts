import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TutorProfileRow {
  id: string;
  user_id: string;
  headline: string | null;
  category: string | null;
  subjects: string[] | null;
  hourly_rate: number | null;
  experience_years: number | null;
  education: string | null;
  languages: string[] | null;
  is_verified: boolean | null;
  verification_status: string | null;
  onboarding_completed: boolean | null;
  total_earnings: number | null;
  available_balance: number | null;
  avg_rating: number | null;
  total_reviews: number | null;
  total_sessions: number | null;
}

export function useMyTutorProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-tutor-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutor_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as TutorProfileRow | null;
    },
  });
}

/** Returns missing field keys + completion percentage (0-100). */
export function useOnboardingStatus() {
  const { user, profile } = useAuth();
  const { data: tp, isLoading } = useMyTutorProfile();

  const checks: { key: string; label: string; ok: boolean }[] = [
    { key: "avatar", label: "Profile photo", ok: !!profile?.avatar_url },
    { key: "bio", label: "Bio", ok: !!(profile?.bio && profile.bio.length >= 20) },
    { key: "location", label: "Location", ok: !!profile?.location },
    { key: "phone", label: "Phone", ok: !!profile?.phone },
    { key: "category", label: "Category", ok: !!tp?.category },
    { key: "subjects", label: "Subjects", ok: !!(tp?.subjects && tp.subjects.length > 0) },
    { key: "experience", label: "Experience years", ok: typeof tp?.experience_years === "number" && tp.experience_years >= 0 && (tp?.experience_years ?? 0) > 0 },
    { key: "rate", label: "Hourly rate", ok: !!(tp?.hourly_rate && tp.hourly_rate > 0) },
  ];

  const completed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const percent = Math.round((completed / total) * 100);
  const missing = checks.filter((c) => !c.ok);
  const isComplete = missing.length === 0;

  return { checks, missing, percent, isComplete, isLoading: isLoading || !user, hasProfile: !!tp };
}

export function useUpdateTutorProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<TutorProfileRow>) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("tutor_profiles")
        .upsert({ user_id: user.id, ...input }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tutor-profile"] });
    },
  });
}
