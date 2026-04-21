import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorListItem {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  category: string | null;
  subjects: string[];
  hourly_rate: number;
  avg_rating: number;
  total_reviews: number;
  total_sessions: number;
  is_verified: boolean;
}

export interface TutorFilters {
  search?: string;
  category?: string;
  subject?: string;
  minRating?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "rating" | "price-low" | "price-high";
}

export function useTutors(filters: TutorFilters = {}) {
  const { search = "", category = "", subject = "", minRating = 0, page = 1, pageSize = 9, sortBy = "rating" } = filters;

  return useQuery({
    queryKey: ["tutors", { search, category, subject, minRating, page, pageSize, sortBy }],
    queryFn: async () => {
      // Step 1: query tutor_profiles (no join — avoids FK schema cache issues)
      let q = supabase
        .from("tutor_profiles")
        .select("id, user_id, headline, category, subjects, hourly_rate, avg_rating, total_reviews, total_sessions, is_verified", { count: "exact" })
        .eq("is_active", true);

      if (category) q = q.eq("category", category);
      if (subject) q = q.contains("subjects", [subject]);
      if (minRating > 0) q = q.gte("avg_rating", minRating);

      const order = sortBy === "price-low" ? { col: "hourly_rate", asc: true }
        : sortBy === "price-high" ? { col: "hourly_rate", asc: false }
        : { col: "avg_rating", asc: false };
      q = q.order(order.col, { ascending: order.asc });

      // Use a wider range when searching since we filter client-side by name afterward
      const fetchSize = search ? 200 : pageSize;
      const from = search ? 0 : (page - 1) * pageSize;
      q = q.range(from, from + fetchSize - 1);

      const { data: tps, error, count } = await q;
      if (error) throw error;

      const userIds = (tps || []).map((r: any) => r.user_id);
      let profilesMap = new Map<string, any>();
      if (userIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url, bio")
          .in("user_id", userIds);
        (profs || []).forEach((p: any) => profilesMap.set(p.user_id, p));
      }

      let items: TutorListItem[] = (tps || []).map((row: any) => {
        const p = profilesMap.get(row.user_id) || {};
        return {
          id: row.id,
          user_id: row.user_id,
          full_name: p.full_name || "Tutor",
          avatar_url: p.avatar_url || null,
          bio: row.headline || p.bio || "",
          category: row.category,
          subjects: row.subjects || [],
          hourly_rate: Number(row.hourly_rate || 0),
          avg_rating: Number(row.avg_rating || 0),
          total_reviews: row.total_reviews || 0,
          total_sessions: row.total_sessions || 0,
          is_verified: !!row.is_verified,
        };
      });

      let total = count || 0;
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(t =>
          t.full_name.toLowerCase().includes(s) ||
          (t.bio || "").toLowerCase().includes(s) ||
          (t.category || "").toLowerCase().includes(s) ||
          t.subjects.some(sub => sub.toLowerCase().includes(s))
        );
        total = items.length;
        const start = (page - 1) * pageSize;
        items = items.slice(start, start + pageSize);
      }

      return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
    },
  });
}

export function useTutorCategories() {
  return useQuery({
    queryKey: ["tutor-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutor_profiles")
        .select("category, subjects")
        .eq("is_active", true);
      if (error) throw error;
      const map = new Map<string, Set<string>>();
      (data || []).forEach((r: any) => {
        if (!r.category) return;
        if (!map.has(r.category)) map.set(r.category, new Set());
        (r.subjects || []).forEach((s: string) => map.get(r.category)!.add(s));
      });
      return Array.from(map.entries()).map(([cat, subs]) => ({ category: cat, subjects: Array.from(subs).sort() }));
    },
  });
}

export function useTutor(tutorProfileId: string | undefined) {
  return useQuery({
    queryKey: ["tutor", tutorProfileId],
    enabled: !!tutorProfileId,
    queryFn: async () => {
      const { data: tp, error } = await supabase
        .from("tutor_profiles")
        .select("*")
        .eq("id", tutorProfileId!)
        .maybeSingle();
      if (error) throw error;
      if (!tp) return null;
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, bio, location")
        .eq("user_id", tp.user_id)
        .maybeSingle();
      return { ...tp, profiles: prof || null };
    },
  });
}

export function useTutorAvailability(tutorProfileId: string | undefined) {
  return useQuery({
    queryKey: ["tutor-availability", tutorProfileId],
    enabled: !!tutorProfileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("tutor_id", tutorProfileId!)
        .order("day_of_week");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useTutorReviews(tutorUserId: string | undefined) {
  return useQuery({
    queryKey: ["tutor-reviews", tutorUserId],
    enabled: !!tutorUserId,
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("tutor_id", tutorUserId!)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
  });
}
