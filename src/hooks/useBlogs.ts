import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BlogInput {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[];
  cover_image?: string | null;
  is_published?: boolean;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

export function useBlogList(opts: { search?: string; category?: string; status?: string } = {}) {
  const { search = "", category = "", status = "" } = opts;
  return useQuery({
    queryKey: ["blogs-list", { search, category, status }],
    queryFn: async () => {
      let q = supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (status === "published") q = q.eq("is_published", true);
      if (status === "draft") q = q.eq("is_published", false);
      if (category) q = q.eq("category", category);
      if (search) q = q.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useBlogBySlug(slug?: string) {
  return useQuery({
    queryKey: ["blog", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.from("blogs").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadThumbnail() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("blog-thumbnails").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-thumbnails").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}

export function useUpsertBlog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BlogInput) => {
      if (!user) throw new Error("Not authenticated");
      const payload: any = {
        title: input.title,
        slug: input.slug || slugify(input.title),
        excerpt: input.excerpt || null,
        content: input.content || null,
        category: input.category || null,
        tags: input.tags || [],
        cover_image: input.cover_image || null,
        is_published: input.is_published ?? false,
        author_id: user.id,
      };
      if (input.id) {
        const { error } = await supabase.from("blogs").update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs-list"] });
      qc.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs-list"] }),
  });
}
