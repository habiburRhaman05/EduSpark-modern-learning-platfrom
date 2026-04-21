import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/* ---------------- Dashboard stats ---------------- */
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, tutors, bookings, payments, pendingVerifs, reviews] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("tutor_profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("bookings").select("amount, status, created_at, scheduled_at"),
        supabase.from("payments").select("amount, platform_fee, status, created_at"),
        (supabase as any).from("tutor_verifications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("rating"),
      ]);

      const allPayments = payments.data || [];
      const completedPayments = allPayments.filter((p: any) => p.status === "completed");
      const totalRevenue = completedPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
      const totalFees = completedPayments.reduce((s: number, p: any) => s + Number(p.platform_fee || 0), 0);
      const allBookings = bookings.data || [];
      const allReviews = reviews.data || [];
      const avgRating = allReviews.length ? allReviews.reduce((s: number, r: any) => s + Number(r.rating || 0), 0) / allReviews.length : 0;

      // 7-day chart
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        const dayPay = completedPayments.filter((p: any) => p.created_at?.slice(0, 10) === key);
        const daySess = allBookings.filter((b: any) => b.created_at?.slice(0, 10) === key);
        return {
          name: d.toLocaleDateString("en-US", { weekday: "short" }),
          revenue: dayPay.reduce((s: number, p: any) => s + Number(p.amount || 0), 0),
          sessions: daySess.length,
        };
      });

      // 6-month
      const now = new Date();
      const monthly = Array.from({ length: 6 }).map((_, i) => {
        const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
        const monthPay = completedPayments.filter((p: any) => {
          const x = new Date(p.created_at);
          return x >= start && x < end;
        });
        return {
          name: start.toLocaleDateString("en-US", { month: "short" }),
          revenue: monthPay.reduce((s: number, p: any) => s + Number(p.amount || 0), 0),
          users: 0,
        };
      });

      return {
        totalUsers: users.count || 0,
        totalTutors: tutors.count || 0,
        totalBookings: allBookings.length,
        totalRevenue,
        totalFees,
        pendingVerifications: pendingVerifs.count || 0,
        avgRating,
        chart: days,
        monthly,
      };
    },
  });
}

/* ---------------- Users with role/status ---------------- */
export function useAdminUsers(opts: { page?: number; pageSize?: number; search?: string; role?: string } = {}) {
  const { page = 1, pageSize = 10, search = "", role = "" } = opts;
  return useQuery({
    queryKey: ["admin-users", { page, pageSize, search, role }],
    queryFn: async () => {
      // Roles join
      let q = supabase.from("profiles").select("id, user_id, full_name, email, avatar_url, phone, created_at", { count: "exact" });
      if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

      const { data: profs, count } = await q
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const userIds = (profs || []).map((p) => p.user_id);
      const { data: roles } = userIds.length
        ? await supabase.from("user_roles").select("user_id, role").in("user_id", userIds)
        : { data: [] as any };

      const roleByUser = new Map<string, string>();
      (roles || []).forEach((r: any) => roleByUser.set(r.user_id, r.role));

      let items = (profs || []).map((p: any) => ({
        ...p,
        role: roleByUser.get(p.user_id) || "student",
      }));

      if (role) items = items.filter((u) => u.role === role);

      return { items, total: count || 0, totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)) };
    },
  });
}

/* ---------------- All bookings ---------------- */
export function useAdminBookings(opts: { page?: number; pageSize?: number; status?: string; search?: string } = {}) {
  const { page = 1, pageSize = 10, status = "", search = "" } = opts;
  return useQuery({
    queryKey: ["admin-bookings", { page, pageSize, status, search }],
    queryFn: async () => {
      let q = supabase.from("bookings").select("*", { count: "exact" });
      if (status) q = q.eq("status", status);
      if (search) q = q.ilike("subject", `%${search}%`);
      const { data, count } = await q
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const userIds = Array.from(new Set<string>((data || []).flatMap((b: any) => [b.student_id as string, b.tutor_id as string])));
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", userIds)
        : { data: [] as any };
      const m = new Map<string, any>();
      (profs || []).forEach((p: any) => m.set(p.user_id, p));

      const items = (data || []).map((b: any) => ({
        ...b,
        student_name: m.get(b.student_id)?.full_name || "Student",
        tutor_name: m.get(b.tutor_id)?.full_name || "Tutor",
        student_avatar: m.get(b.student_id)?.avatar_url || null,
        tutor_avatar: m.get(b.tutor_id)?.avatar_url || null,
      }));

      return { items, total: count || 0, totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)) };
    },
  });
}

/* ---------------- Payments / transactions ---------------- */
export function useAdminPayments(opts: { page?: number; pageSize?: number; status?: string; search?: string } = {}) {
  const { page = 1, pageSize = 10, status = "", search = "" } = opts;
  return useQuery({
    queryKey: ["admin-payments", { page, pageSize, status, search }],
    queryFn: async () => {
      let q = supabase.from("payments").select("*", { count: "exact" });
      if (status) q = q.eq("status", status);
      if (search) q = q.ilike("transaction_ref", `%${search}%`);
      const { data, count } = await q
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const userIds = Array.from(new Set<string>((data || []).flatMap((p: any) => [p.payer_id as string, p.payee_id as string])));
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds)
        : { data: [] as any };
      const m = new Map<string, string>();
      (profs || []).forEach((p: any) => m.set(p.user_id, p.full_name));

      const items = (data || []).map((p: any) => ({
        ...p,
        payer_name: m.get(p.payer_id) || "—",
        payee_name: m.get(p.payee_id) || "—",
      }));

      return { items, total: count || 0, totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)) };
    },
  });
}

/* ---------------- Verification applications ---------------- */
export function useAdminVerifications(opts: { status?: string } = {}) {
  const { status = "" } = opts;
  return useQuery({
    queryKey: ["admin-verifications", { status }],
    queryFn: async () => {
      let q = (supabase as any).from("tutor_verifications").select("*").order("submitted_at", { ascending: false });
      if (status) q = q.eq("status", status);
      const { data, error } = await q;
      if (error) {
        if (error.message?.toLowerCase().includes("does not exist") || error.code === "42P01") {
          throw new Error("Verification system not initialized. Please run SEED_DATA.sql in Supabase SQL Editor.");
        }
        throw error;
      }
      const userIds = Array.from(new Set<string>((data || []).map((v: any) => v.tutor_id as string)));
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("user_id, full_name, avatar_url, email").in("user_id", userIds)
        : { data: [] as any };
      const m = new Map<string, any>();
      (profs || []).forEach((p: any) => m.set(p.user_id, p));

      return (data || []).map((v: any) => ({
        ...v,
        tutor_name: m.get(v.tutor_id)?.full_name || v.full_name,
        tutor_email: m.get(v.tutor_id)?.email,
        tutor_avatar: m.get(v.tutor_id)?.avatar_url,
      }));
    },
    retry: false,
  });
}

export function useReviewVerification() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, tutorId, status, reason }: { id: string; tutorId: string; status: "approved" | "rejected"; reason?: string }) => {
      const { error } = await (supabase as any)
        .from("tutor_verifications")
        .update({
          status,
          rejection_reason: status === "rejected" ? (reason || "Documents did not meet our requirements") : null,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;

      // Mirror to tutor_profiles
      await supabase
        .from("tutor_profiles")
        .update({
          verification_status: status,
          is_verified: status === "approved",
        })
        .eq("user_id", tutorId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-verifications"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

/** Get a signed URL for a private verification doc */
export async function signedDocUrl(path: string) {
  const { data } = await supabase.storage.from("verification-docs").createSignedUrl(path, 60 * 10);
  return data?.signedUrl || null;
}

/* ---------------- Categories CRUD ---------------- */
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("categories")
        .select("id, name, slug, icon, subjects, created_at")
        .order("name");
      if (error) {
        if (error.message?.toLowerCase().includes("does not exist") || error.code === "42P01") {
          throw new Error("Categories table not initialized. Please run SEED_DATA.sql in Supabase SQL Editor.");
        }
        throw error;
      }
      // Tutor counts per category
      const { data: tps } = await supabase.from("tutor_profiles").select("category").eq("is_active", true);
      const counts = new Map<string, number>();
      (tps || []).forEach((r: any) => {
        if (!r.category) return;
        counts.set(r.category, (counts.get(r.category) || 0) + 1);
      });
      return (data || []).map((c: any) => ({ ...c, tutor_count: counts.get(c.name) || 0 }));
    },
    retry: false,
  });
}

export function useUpsertCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; name: string; slug: string; icon?: string; subjects: string[] }) => {
      const payload: any = { name: input.name, slug: input.slug, icon: input.icon || null, subjects: input.subjects };
      if (input.id) payload.id = input.id;
      const { error } = await (supabase as any).from("categories").upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
