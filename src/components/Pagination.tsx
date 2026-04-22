import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  perPage?: number;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, total, perPage, className }: PaginationProps) {
  if (totalPages <= 1 && !total) return null;

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const showingFrom = total && perPage ? Math.min((page - 1) * perPage + 1, total) : 0;
  const showingTo = total && perPage ? Math.min(page * perPage, total) : 0;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-6 flex flex-col sm:flex-row items-center justify-between gap-3",
        "rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm px-3 py-2",
        className
      )}
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm font-medium transition-colors",
          "text-foreground hover:bg-muted",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <ul className="flex items-center gap-1 order-first sm:order-none">
        {getVisiblePages().map((p, i) =>
          p === "..." ? (
            <li key={`dots-${i}`} aria-hidden className="px-1.5 text-sm text-muted-foreground select-none">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p as number)}
                aria-current={page === p ? "page" : undefined}
                aria-label={`Go to page ${p}`}
                className={cn(
                  "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-full text-sm font-medium transition-all",
                  page === p
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15 shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>

      {/* Next + showing */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm font-medium transition-colors",
            "text-foreground hover:bg-muted",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {total != null && perPage != null && (
          <p className="hidden md:block text-xs text-muted-foreground whitespace-nowrap pl-3 border-l border-border">
            Showing <span className="font-semibold text-foreground">{showingFrom}</span>–
            <span className="font-semibold text-foreground">{showingTo}</span> of{" "}
            <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
          </p>
        )}
      </div>
    </nav>
  );
}
