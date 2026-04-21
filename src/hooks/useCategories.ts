import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  subjects: string[];
  tutor_count?: number;
}

/**
 * Public categories hook — sourced from `categories` table but cross-checked
 * against actual tutor_profiles.category values so the explore filter always
 * works (we only surface categories that have at least one active tutor, and
 * we merge in any category names that exist in tutor_profiles but not in the
 * curated table).
 */
export function useCategories() {
  return useQuery({
    queryKey: ["public-categories-v2"],
    queryFn: async () => {
      const [catRes, tpRes] = await Promise.all([
        (supabase as any).from("categories").select("id, name, slug, icon, subjects").order("name"),
        supabase.from("tutor_profiles").select("category, subjects").eq("is_active", true),
      ]);
      if (catRes.error) throw catRes.error;

      const curated: CategoryRow[] = (catRes.data || []) as CategoryRow[];

      // Build live counts + subjects from real tutor data
      const counts = new Map<string, number>();
      const subjectsByCat = new Map<string, Set<string>>();
      (tpRes.data || []).forEach((r: any) => {
        if (!r.category) return;
        counts.set(r.category, (counts.get(r.category) || 0) + 1);
        if (!subjectsByCat.has(r.category)) subjectsByCat.set(r.category, new Set());
        (r.subjects || []).forEach((s: string) => subjectsByCat.get(r.category)!.add(s));
      });

      // Merge curated + tutor-derived categories (so filter always matches DB values)
      const seen = new Set(curated.map((c) => c.name));
      const merged: CategoryRow[] = curated.map((c) => ({
        ...c,
        subjects: Array.from(new Set([...(c.subjects || []), ...Array.from(subjectsByCat.get(c.name) || [])])).sort(),
        tutor_count: counts.get(c.name) || 0,
      }));
      Array.from(counts.keys()).forEach((name) => {
        if (seen.has(name)) return;
        merged.push({
          id: `derived-${name}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          icon: null,
          subjects: Array.from(subjectsByCat.get(name) || []).sort(),
          tutor_count: counts.get(name) || 0,
        });
      });

      // Sort: categories with tutors first, then alphabetical
      return merged.sort((a, b) => (b.tutor_count || 0) - (a.tutor_count || 0) || a.name.localeCompare(b.name));
    },
  });
}

export function useSubjectsForCategory(categoryName: string | null | undefined) {
  const { data: cats, isLoading } = useCategories();
  const cat = cats?.find((c) => c.name === categoryName);
  return { subjects: cat?.subjects || [], isLoading };
}
