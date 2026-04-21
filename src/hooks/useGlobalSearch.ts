import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SearchTutor {
  id: string;
  name: string;
  category: string | null;
}
export interface SearchBlog {
  id: string;
  slug: string;
  title: string;
}

export function useGlobalSearch(query: string) {
  const [tutors, setTutors] = useState<SearchTutor[]>([]);
  const [blogs, setBlogs] = useState<SearchBlog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setTutors([]);
      setBlogs([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const [tRes, bRes] = await Promise.all([
          supabase
            .from("tutor_profiles")
            .select("id, user_id, category, headline")
            .or(`headline.ilike.%${q}%,category.ilike.%${q}%`)
            .limit(5),
          supabase
            .from("blogs")
            .select("id, slug, title")
            .eq("is_published", true)
            .ilike("title", `%${q}%`)
            .limit(5),
        ]);

        if (cancelled) return;

        const tutorRows = tRes.data || [];
        const userIds = tutorRows.map((t: any) => t.user_id).filter(Boolean);
        let nameMap = new Map<string, string>();
        if (userIds.length) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);
          (profs || []).forEach((p: any) => nameMap.set(p.id, p.full_name));
        }

        if (cancelled) return;
        setTutors(
          tutorRows.map((t: any) => ({
            id: t.id,
            name: nameMap.get(t.user_id) || "Tutor",
            category: t.category,
          }))
        );
        setBlogs((bRes.data || []) as SearchBlog[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  return { tutors, blogs, loading };
}
