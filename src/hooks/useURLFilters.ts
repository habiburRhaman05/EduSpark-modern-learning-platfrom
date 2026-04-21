import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export function useURLFilters(defaults?: { perPage?: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = defaults?.perPage || 10;

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "";

  const setFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // Reset page when filters change (unless setting page itself)
        if (key !== "page") next.delete("page");
        return next;
      });
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (p: number) => setFilter("page", p > 1 ? String(p) : ""),
    [setFilter]
  );

  const paginate = useCallback(
    <T,>(items: T[]): { items: T[]; totalPages: number; total: number } => {
      const total = items.length;
      const totalPages = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      return { items: items.slice(start, start + perPage), totalPages, total };
    },
    [page, perPage]
  );

  return useMemo(
    () => ({ page, search, status, category, sortBy, setFilter, setPage, paginate, perPage }),
    [page, search, status, category, sortBy, setFilter, setPage, paginate, perPage]
  );
}
